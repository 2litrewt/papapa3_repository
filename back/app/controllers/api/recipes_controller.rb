module Api
  class RecipesController < ApplicationController
    # GET /api/recipes
    def index
      keyword = params[:keyword]
      cooking_time = params[:cooking_time] # 調理時間
      price_range = params[:price_range]  # 価格帯
      nutrition_type = params[:nutrition_type] # 栄養タイプ
      sort_by = params[:sortBy] || 'created_at' # ソート項目
      order = params[:order] || 'asc' # 昇降順

      # ベースクエリ
      recipes = Recipe.includes(:ingredients)

      # キーワード検索
      if keyword.present?
        recipes = recipes.where('title ILIKE ? OR description ILIKE ?', "%#{keyword}%", "%#{keyword}%")
      end

      # 価格帯の条件
      if price_range.present?
        case price_range
        when 'low'
          recipes = recipes.where('price <= ?', 500)
        when 'medium'
          recipes = recipes.where('price > ? AND price <= ?', 500, 1000)
        when 'high'
          recipes = recipes.where('price > ?', 1000)
        end
      end

      # 調理時間の条件
      if cooking_time.present?
        case cooking_time
        when 'short'
          recipes = recipes.where('cooking_time <= ?', 30)
        when 'medium'
          recipes = recipes.where('cooking_time > ? AND cooking_time <= ?', 30, 60)
        when 'long'
          recipes = recipes.where('cooking_time > ?', 60)
        end
      end

      # 栄養タイプの条件（Ruby側で並び替え）
      if nutrition_type.present?
        recipes = recipes.sort_by do |recipe|
          total_protein = recipe.ingredients.sum(&:protein).to_f
          total_carbohydrate = recipe.ingredients.sum(&:carbohydrate).to_f
          total_fat = recipe.ingredients.sum(&:fat).to_f

          Rails.logger.info "Recipe ID: #{recipe.id}, Protein: #{total_protein}, Carbohydrate: #{total_carbohydrate}, Fat: #{total_fat}"

          case nutrition_type
          when 'high_protein'
            -total_protein # 多い順（降順）
          when 'low_carb'
            total_carbohydrate # 少ない順（昇順）
          when 'low_fat'
            total_fat # 少ない順（昇順）
          else
            0
          end
        end
      end

      # 最終的な並び替えを適用
      if recipes.is_a?(ActiveRecord::Relation)
        order_conditions = []
        order_conditions << "price #{order.upcase}" if price_range.present?
        order_conditions << "cooking_time #{order.upcase}" if cooking_time.present?

        # ActiveRecord::Relation に適用
        recipes = recipes.order(order_conditions.join(", ")) unless order_conditions.empty?
      else
        # `recipes` が `Array` の場合、sort_by で並び替え
        recipes = recipes.sort_by do |recipe|
          [
            price_range.present? ? recipe.price : 0,
            cooking_time.present? ? recipe.cooking_time : 0
          ]
        end
        recipes.reverse! if order == 'desc'
      end

      # レスポンス
      render json: recipes.as_json(only: [:id, :title, :description, :cooking_time, :price, :image], include: {
        category: { only: [:id, :name] },
        tags: { only: [:id, :name] },
        ingredients: { only: [:name, :protein, :carbohydrate, :fat] },
        user: { only: [:id, :name, :profile_image] }
      })

    end


    def show
      recipe = Recipe.includes(:ingredients, :category, :user, :steps).find_by(id: params[:id])
    
      if recipe
        total_protein = recipe.ingredients.sum(&:protein)
        total_carbohydrate = recipe.ingredients.sum(&:carbohydrate)
        total_fat = recipe.ingredients.sum(&:fat)
    
        render json: recipe.as_json(only: [:id, :title, :description, :cooking_time, :price,]).merge({
          category_name: recipe.category&.name,
          user_name: recipe.user&.name,
          total_nutrition: {
            protein: total_protein,
            carbohydrate: total_carbohydrate,
            fat: total_fat
          },
          ingredients: recipe.ingredients.pluck(:name),
          steps: recipe.steps.map { |step| { step_number: step.step_number, instruction: step.instruction } }
        })
      else
        render json: { error: 'Recipe not found' }, status: :not_found
      end
    end

    private

    def set_recipe
      @recipe = Recipe.find(params[:id])
    rescue ActiveRecord::RecordNotFound
      render json: { error: 'Recipe not found' }, status: :not_found
    end
  end
end

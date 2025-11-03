export enum PostCategory {
  DogCare = 0,
  CatCare = 1,
  PetNutrition = 2,
  PetTraining = 3
}

export const PostCategoryLabels: Record<PostCategory, string> = {
  [PostCategory.DogCare]: 'Chăm sóc chó',
  [PostCategory.CatCare]: 'Chăm sóc mèo',
  [PostCategory.PetNutrition]: 'Dinh dưỡng thú cưng',
  [PostCategory.PetTraining]: 'Huấn luyện thú cưng'
};
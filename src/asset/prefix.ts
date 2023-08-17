export const redisPrefix = {
    recipePostViewCount: (id: number | string) => `recipePostViewCnt:${id}`,
    foodPostViewCount: (id: number | string) => `foodPostViewCnt:${id}`,
};

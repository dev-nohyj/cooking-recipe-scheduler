import { InjectRedis, Redis } from '@nestjs-modules/ioredis';
import { Injectable } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { customErrorLabel } from 'src/asset/labels/error';
import { redisPrefix } from 'src/asset/prefix';
import { CustomError } from 'src/error/custom.error';
import { PrismaDatabase } from 'src/prisma/prisma.service';

@Injectable()
export class SchedulerService {
    //@ts-ignore
    constructor(@InjectRedis() private readonly redis: Redis, private readonly prismaDatabase: PrismaDatabase) {}

    @Interval(1000 * 60 * 1)
    async handleUpdateRecipeView() {
        try {
            const updateViewCount = await this.redis.keys(redisPrefix.recipePostViewCount('*'));
            if (updateViewCount.length === 0) return;
            updateViewCount.forEach(async (key) => {
                const id = parseInt(key.split(':')[1]);
                const viewCount = await this.redis.get(redisPrefix.recipePostViewCount(id));
                if (!viewCount) return;

                const redisViewCount = JSON.parse(viewCount);
                const existingRecipePost = await this.prismaDatabase.recipePost.findUnique({
                    where: { id },
                    select: { viewCount: true },
                });
                if (!existingRecipePost) {
                    await this.redis.del(redisPrefix.recipePostViewCount(id));
                    return;
                }

                if (redisViewCount.viewCount > 0 && redisViewCount.viewCount > existingRecipePost.viewCount) {
                    await this.prismaDatabase.recipePost.update({
                        where: { id },
                        data: {
                            viewCount: redisViewCount.viewCount,
                        },
                    });
                }

                await this.redis.del(redisPrefix.recipePostViewCount(id));
            });
        } catch (err) {
            throw new CustomError({ customError: customErrorLabel.SCHEDULER_ERROR.customError });
        }
    }

    @Interval(1000 * 60 * 1)
    async handleUpdateFoodView() {
        try {
            const updateViewCount = await this.redis.keys(redisPrefix.foodPostViewCount('*'));
            if (updateViewCount.length === 0) return;
            updateViewCount.forEach(async (key) => {
                const id = parseInt(key.split(':')[1]);
                const viewCount = await this.redis.get(redisPrefix.foodPostViewCount(id));
                if (!viewCount) return;

                const redisViewCount = JSON.parse(viewCount);
                const existingFoodPost = await this.prismaDatabase.foodPost.findUnique({
                    where: { id },
                    select: { viewCount: true },
                });
                if (!existingFoodPost) {
                    await this.redis.del(redisPrefix.foodPostViewCount(id));
                    return;
                }

                if (redisViewCount.viewCount > 0 && redisViewCount.viewCount > existingFoodPost.viewCount) {
                    await this.prismaDatabase.foodPost.update({
                        where: { id },
                        data: {
                            viewCount: redisViewCount.viewCount,
                        },
                    });
                }

                await this.redis.del(redisPrefix.foodPostViewCount(id));
            });
        } catch (err) {
            throw new CustomError({ customError: customErrorLabel.SCHEDULER_ERROR.customError });
        }
    }
}

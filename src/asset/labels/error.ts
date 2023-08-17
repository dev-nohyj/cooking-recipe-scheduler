export const customErrorLabel = {
    UNKNOWN: {
        code: 1,
        customError: 'UNKNOWN',
        clientMsg: '오류가 발생했습니다! 다시 시도해 주세요.',
    },
    NOTFOUND: {
        code: 404,
        customError: 'NOTFOUND',
        clientMsg: 'NOTFOUND',
    },
    PRISMA_ERROR: {
        code: 10002,
        customError: 'PRISMA_ERROR',
        clientMsg: '시스템 에러가 발생했습니다. 다시 시도해 주세요.',
    },
    S3_ERROR: {
        code: 10003,
        customError: 'S3_ERROR',
        clientMsg: '시스템 에러가 발생했습니다. 다시 시도해 주세요.',
    },
    SCHEDULER_ERROR: {
        code: 20001,
        customError: 'SYSTEM_ERROR',
        clientMsg: '스케쥴러 에러',
    },
};

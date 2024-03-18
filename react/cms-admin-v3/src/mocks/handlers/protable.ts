import dayjs from 'dayjs';
import { rest } from 'msw';
import { db } from '../db';

const getTableHandler = rest.post(
    '/protable',
    async (request, response, context) => {
        const reqJson = await request.json();
        const reqBody = reqJson.data;

        let protableData = db.protableData.findMany({
            where: {
                title: reqBody?.title && {
                    contains: reqBody.title,
                },
                state: (reqBody?.state) && {
                    equals: reqBody?.state
                },
                process: reqBody?.process && reqBody?.process != 1 && {
                    equals: reqBody.process,
                },
                locked: reqBody?.filter?.locked?.length === 1 ? {
                    equals: reqBody.filter.locked[0]
                } : undefined
            },
            orderBy: reqBody?.sort?.created_at && {
                created_at: reqBody.sort.created_at === 'ascend' ? 'asc' : 'desc',
            },
            take: reqBody?.pageSize ?? 10,
            skip: reqBody?.current && reqBody?.pageSize ? (parseInt(reqBody?.current) - 1) * parseInt(reqBody?.pageSize) : 0,
        })

        let protableDataTotal = db.protableData.findMany({
            where: {
                title: reqBody?.title && {
                    contains: reqBody.title,
                },
                state: (reqBody?.state) && {
                    equals: reqBody?.state
                },
                process: reqBody?.process && reqBody?.process != 1 && {
                    equals: reqBody.process,
                },
                locked: reqBody?.filter?.locked?.length === 1 ? {
                    equals: reqBody.filter.locked[0]
                } : undefined
            },
            orderBy: reqBody?.sort?.created_at && {
                created_at: reqBody.sort.created_at === 'ascend' ? 'asc' : 'desc',
            },
        });

        let protable = {
            data: protableData,
            page: reqBody?.current ?? 1,
            total: protableDataTotal.length,
            success: true,
        }

        return response(
            context.delay(0.2 * 1000),
            context.status(200),
            context.json(protable)
        );
    }
);

const crudTableHandler = rest.post(
    '/protable/crud',
    async (request, response, context) => {
        const reqJson = await request.json();
        const reqBody = reqJson.data;
        console.log(reqBody);
        
        if (reqBody?.type === 'create') {
            db.protableData.create(
                {
                    number: 100,
                    title: `标题100`,
                    state: 'open',
                    locked: 'false',
                    comments: 1,
                    created_at: dayjs('2023-01-01').format('YYYY-MM-DDTHH:mm:ssZ'),
                    updated_at: dayjs('2023-01-01').format('YYYY-MM-DDTHH:mm:ssZ'),
                    author_association: "NONE",
                    user: `user40`,
                }
            )
        } else if (reqBody?.type === 'update') {
            db.protableData.update({
                where: {
                    number: {
                        equals: parseInt(reqBody?.params?.number),
                    },
                },
                data: reqBody?.params,
            })
        } else if (reqBody?.type === 'delete') {
            db.protableData.delete({
                where: {
                    number: {
                        in: reqBody?.params?.map(p => parseInt(p?.number)),
                    },
                },
            })
        }

        let protable = {
            success: true,
        }

        return response(
            context.delay(0.2 * 1000),
            context.status(200),
            context.json(protable)
        );
    }
);

export const tableHandlers = [
    getTableHandler,
    crudTableHandler
];
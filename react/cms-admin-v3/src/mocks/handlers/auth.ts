import { rest } from 'msw';
import { db } from '../db';

const getPermissionHandler = rest.get(
  '/permission/:userId',
  async (req, res, ctx) => {
    const userId = req.params.userId as string;

    const user = db.user.findFirst({
      where: {
        id: {
          equals: userId,
        }
      }
    });

    return res(
      ctx.delay(300),
      ctx.json(user)
    );
  }
);
const getLogHandler = rest.get(
  '/loglist/:userName',
  async (req, res, ctx) => {
    const userName = req.params.userName as string;

    const user = db.logList.findFirst({
      where: {
        operator_name: {
          equals: userName,
        }
      }
    });

    return res(
      ctx.delay(300),
      ctx.json(user)
    );
  }
);
const getresourceHandler = rest.get(
  '/resource/:userName',
  async (req, res, ctx) => {
    const userName = req.params.userName as string;

    const resource = db.resource.findFirst({
      where: {
        name: {
          equals: userName,
        }
      }
    });

    return res(
      ctx.delay(300),
      ctx.json(resource)
    );
  }
);
const getResourcesHandler = rest.get(
  '/resources',
  async (req, res, ctx) => {
    const resources = db.resource.getAll();
    return res(
      ctx.delay(300),
      ctx.status(200),
      ctx.json(resources)
    );
  }
);
const getLogListHandler = rest.get(
  '/logslist',
  async (req, res, ctx) => {
    const loglist = db.logList.getAll();
    return res(
      ctx.delay(300),
      ctx.status(200),
      ctx.json(loglist)
    );
  }
);
const getUsersHandler = rest.get(
  '/users',
  async (req, res, ctx) => {
    const users = db.user.getAll();
    return res(
      ctx.delay(300),
      ctx.status(200),
      ctx.json(users)
    );
  }
);
const getRolesHandler = rest.get(
  '/roles',
  async (req, res, ctx) => {
    const roles = db.role.getAll();

    return res(
      ctx.delay(300),
      ctx.status(200),
      ctx.json(roles)
    );
  }
);

const createRoleHandler = rest.post(
  '/roles',
  async (req, res, ctx) => {
    const roleData = await req.json();
    const role = db.role.create({
      ...roleData
    });

    return res(
      ctx.delay(300),
      ctx.status(200),
      ctx.json(role)
    );
  }
);

const createResourceHandler = rest.post(
  '/resource',
  async (req, res, ctx) => {
    const roleData = await req.json();
    const role = db.role.create({
      ...roleData
    });

    return res(
      ctx.delay(300),
      ctx.status(200),
      ctx.json(role)
    );
  }
);

const getLoginHandler = rest.get(
  '/login/:account/:password',
  async (req, res, ctx) => {
    const account = req.params.account as string;
    const password = req.params.password as string;
    const user = db.logIn.findFirst({
      where: {
        account: {
          equals: account,
        },
        password: {
          equals: password,
        }
      }
    });
    return res(
      ctx.delay(300),
      ctx.json(user),
    );
  }
);

const createUpdateHandler = rest.post(
  '/update',
  async (req, res, ctx) => {
    const roleData = await req.json();
    const role = db.role.create({
      ...roleData
    });

    return res(
      ctx.delay(300),
      ctx.status(200),
      ctx.json(role)
    );
  }
);

const getDicHandler = rest.get(
  '/dictionaries/:id',
  async (req, res, ctx) => {
    const id = req.params.id as string;
    const dictionaries = db.dicTionaries.findFirst({
      where: {
        id: {
          equals: id,
        }
      }
    });
    return res(
      ctx.delay(300),
      ctx.json(dictionaries),
    );
  }
);

const getUserInfoHandler = rest.get(
  '/userInfo/',
  async (req, res, ctx) => {
    const userInfo = db.userInfo.getAll();
    return res(
      ctx.delay(300),
      ctx.json(userInfo),
    );
  }
);

const getClassInfoHandler = rest.get(
  '/category/:id',
  async (req, res, ctx) => {
    const id = req.params.id as string;
    const classInfo = db.classInfo.findFirst({
      where: {
        id: {
          equals: id,
        }
      }
    });
    return res(
      ctx.delay(300),
      ctx.json(classInfo),
    );
  }
);


export const authHandlers = [
  getPermissionHandler,
  getRolesHandler,
  createRoleHandler,
  getUsersHandler,
  getResourcesHandler,
  getLogListHandler,
  getLoginHandler,
  getLogHandler,
  getresourceHandler,
  createResourceHandler,
  createUpdateHandler,
  getDicHandler,
  getUserInfoHandler,
  getClassInfoHandler
];
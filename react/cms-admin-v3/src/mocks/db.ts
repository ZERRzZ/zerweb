import { uid } from "@/utils/utility";
import { factory, primaryKey, manyOf } from "@mswjs/data";

const models = {
  user: {
    id: primaryKey(String),
    name: String, // 名称,
    roles: manyOf('role'),
  },
  role: {
    id: primaryKey(uid),
    createdAt: Date.now,
    name: String, // 中文名称
    alias: String, // 别名,
    description: String, // 描述
    resources: manyOf('resource'),
  },
  resource: {
    id: primaryKey(uid),
    createdAt: Date.now,
    name: String, // 中文名称
    identity: String, // 标识符
    group: String,//父类
  },
  protable: {
    id: primaryKey(uid),
    data: manyOf('protableData'),
    page: Number,
    success: Boolean,
    total: Number,
  },
  protableData: {
    id: primaryKey(uid),
    number: Number,
    title: String,
    state: String,
    process: String,
    locked: String,
    comments: Number,
    created_at: String,
    updated_at: String,
    author_association: String,
    user: String,
  },
  file: {
    id: primaryKey(uid),
    url: String
  },
  logList: {
    id: primaryKey(String),
    operation_time: Date.now,//操作时间
    operator_name: String, // 操作人物
    target_type: String,//操作的模块
    target_name: String,//操作的对象
    action: String, // 操作
    operator_ip: String, // ip地址
  },
  logIn: {
    user_id: primaryKey(String),
    operation_time: Date.now,//操作时间
    fullname: String, //用户名
    account: String, //账户
    password: String, //密码
    user: {
      account: String,
      fullname: String,
      is_admin: Boolean,
      user_id: Number,
    },
    token: {
      access_token: String,
      end_time: Date.now,
      refresh_token: String,
      scope: String,
      expires_in: String,
    }, //用户token
    license_key: String,
  },
  dicTionaries: {
    id: primaryKey(String),
    children_category_dtolist: Array,
    level: Number,
    name: String,
    operation_time: Date.now,//操作时间
  },
  userInfo: {
    user_id: primaryKey(String),
    user: {
      account: String,
      fullname: String,
      is_admin: Boolean,
      user_id: Number,
    },
    token: {
      access_token: String,
      end_time: Date.now,
      refresh_token: String,
      scope: String,
      expires_in: String,
    }, //用户token
    license_key: String,
  },
  classInfo: {
    id: primaryKey(String),
    level: Number,
    name: String,
    children_category_dtolist: Array,
  },
};

export const db = factory(models);
import { setupWorker } from "msw";
import { handlers } from "./handlers";
import { db } from "./db";
import dayjs from "dayjs";

export default function initializeMocks() {
  const worker = setupWorker(...handlers);
  worker.start();
  seedDb();
}

function seedDb() {
  const userCount = db.user.count();
  if (userCount > 0) return;

  const resources1 = [
    db.resource.create({ name: "用户管理", identity: "user_manage", group: "用户管理" }),
    db.resource.create({ name: "日志管理", identity: "log_manage", group: "日志管理" }),
  ];
  const resources2 = [
    db.resource.create({ identity: 'role_manage', name: '角色管理', group: '角色管理', }),
  ];
  const resources3 = [
    db.resource.create({ identity: 'resource_manage', name: '权限资源管理', group: '权限资源管理' }),
    db.resource.create({ identity: 'project_manage', name: '项目管理', group: '项目管理' }),
    db.resource.create({ identity: 'msg_manage', name: '消息管理', group: '消息管理' }),
  ];


  const role1 = [
    db.role.create({ name: "管理员", alias: "admin", description: "", resources: resources1 }),
  ];
  const role2 = [
    db.role.create({ name: "用户", alias: "user", description: "", resources: resources2 }),
  ];

  db.user.create({
    id: "10000082010367",
    name: "用户管理员",
    roles: role1,
  },
  );
  db.user.create({
    id: "10000031112923",
    name: "日志管理员",
    roles: role2,
  })
  db.user.create({
    id: "1153431684268429300",
    name: "日志管理员",
    roles: role1,
  })

  const protableData: any[] = [];
  for (let i = 0; i < 60; i++) {
    protableData.push(db.protableData.create({
      number: i + 1,
      title: `标题${i + 1}`,
      state: i % 2 === 0 ? 'open' : 'closed',
      locked: i % 3 === 0 ? 'true' : 'false',
      process: i % 4 === 0 ? '2' : i % 5 === 0 ? '3' : '1',
      comments: Number((Math.random() * 10).toFixed(4)),
      created_at: dayjs('2023-01-01').add(i, 'day').format('YYYY-MM-DD'),
      updated_at: dayjs('2023-01-01').add(i, 'day').format('YYYY-MM-DD'),
      author_association: "NONE",
      user: `user${i}`,
    }))
  }
  db.protable.create({
    id: '10',
    data: protableData,
    page: 1,
    success: true,
    total: 5,
  })

  db.file.create({
    url: 'https://img2.woyaogexing.com/2023/01/09/2db873b9e4792365359beeebc32fb12c.png'
  });

  db.logList.create({ id: '1', operator_name: "史梦男1", action: '2222', operator_ip: '127.0.0.1' });
  db.logList.create({ id: '2', operator_name: "史梦男2", action: '2222', operator_ip: '127.0.0.1' });
  db.logList.create({ id: '3', operator_name: "史梦男3", action: '2222', operator_ip: '127.0.0.1' });
  db.logList.create({ id: '4', operator_name: "史梦男4", action: '2222', operator_ip: '127.0.0.1' });
  db.logList.create({ id: '5', operator_name: "史梦男5", action: '2222', operator_ip: '127.0.0.1' });
  db.logList.create({ id: '6', operator_name: "史梦男6", action: '2222', operator_ip: '127.0.0.1' });
  db.logList.create({ id: '7', operator_name: "史梦男7", action: '2222', operator_ip: '127.0.0.1' });
  db.logList.create({ id: '8', operator_name: "史梦男8", action: '2222', operator_ip: '127.0.0.1' });
  db.logList.create({ id: '9', operator_name: "史梦男9", action: '2222', operator_ip: '127.0.0.1' });
  db.logList.create({ id: '10', operator_name: "史梦男11", action: '2222', operator_ip: '127.0.0.1' });
  db.logList.create({ id: '11', operator_name: "史梦男22", action: '2222', operator_ip: '127.0.0.1' });
  db.logList.create({ id: '12', operator_name: "史梦男33", action: '2222', operator_ip: '127.0.0.1' });
  db.logList.create({ id: '13', operator_name: "史梦男44", action: '2222', operator_ip: '127.0.0.1' });
  db.logList.create({ id: '14', operator_name: "史梦男55", action: '2222', operator_ip: '127.0.0.1' });
  db.logList.create({ id: '15', operator_name: "史梦男66", action: '2222', operator_ip: '127.0.0.1' });
  db.logList.create({ id: '16', operator_name: "史梦男77", action: '2222', operator_ip: '127.0.0.1' });
  db.logList.create({ id: '17', operator_name: "史梦男88", action: '2222', operator_ip: '127.0.0.1' });
  db.logList.create({ id: '18', operator_name: "史梦男99", action: '2222', operator_ip: '127.0.0.1' });
  db.logList.create({ id: '19', operator_name: "史梦男111", action: '2222', operator_ip: '127.0.0.1' });
  db.logList.create({ id: '20', operator_name: "史梦男222", action: '2222', operator_ip: '127.0.0.1' });
  db.logList.create({ id: '21', operator_name: "史梦男333", action: '2222', operator_ip: '127.0.0.1' });
  db.logList.create({ id: '22', operator_name: "史梦男444", action: '2222', operator_ip: '127.0.0.1' });
  db.logList.create({ id: '23', operator_name: "史梦男555", action: '2222', operator_ip: '127.0.0.1' });
  db.logList.create({ id: '24', operator_name: "史梦男666", action: '2222', operator_ip: '127.0.0.1' });
  db.logList.create({ id: '26', operator_name: "史梦男777", action: '2222', operator_ip: '127.0.0.1' });
  db.logList.create({ id: '27', operator_name: "史梦男888", action: '2222', operator_ip: '127.0.0.1' });
  db.logList.create({ id: '28', operator_name: "史梦男999", action: '2222', operator_ip: '127.0.0.1' });
  db.logList.create({ id: '29', operator_name: "史梦男1111", action: '2222', operator_ip: '127.0.0.1' });

  db.logIn.create(
    {
      user_id: "10000082010367",
      fullname: "用户管理员",
      account: 'sss',
      password: '123',
      user: {
        account: 'sss',
        is_admin: false,
        user_id: 10000082010367,
        fullname: "用户管理员",
      },
      token: {
        access_token: "xqB8b6MyzAACa+OKfGhGOfRo87MD71liZAeOf68vahKV8Lq4XnCmYot+wxTZ2AHeWx3TqKuRD+spDx1Q1OMfkDh8OsydU5QkQQn5i5mcKY8=",
        refresh_token: "548d8d958d7148c29f9f6758068a8f7b",
      },
      license_key: "v0ecvhPVnHViniWindZeiSe5VnA4aIeFPqzADQ/eo/pHOSjdxchKVoVYFhETyFxS",
    }
  )

  db.userInfo.create(
    {
      user_id: "10000082010367",
      user: {
        account: 'sss',
        is_admin: false,
        fullname: "用户管理员",
      },
      token: {
        access_token: "xqB8b6MyzAACa+OKfGhGOfRo87MD71liZAeOf68vahKV8Lq4XnCmYot+wxTZ2AHeWx3TqKuRD+spDx1Q1OMfkDh8OsydU5QkQQn5i5mcKY8=",
        refresh_token: "548d8d958d7148c29f9f6758068a8f7b",
      },
      license_key: "v0ecvhPVnHViniWindZeiSe5VnA4aIeFPqzADQ/eo/pHOSjdxchKVoVYFhETyFxS",
    }
  )
  db.dicTionaries.create(
    {
      id: "10",
      children_category_dtolist: [
        {
          children_category_dtolist: null,
          id: 11,
          level: 3,
          name: "中华人民共和国工业和信息化部"
        }, {
          children_category_dtolist: null,
          id: 12,
          level: 3,
          name: "河南政府网"
        }, {
          children_category_dtolist: null,
          id: 13,
          level: 3,
          name: "中国政府网"
        }, {
          children_category_dtolist: null,
          id: 14,
          level: 3,
          name: "南阳教育网"
        }, {
          children_category_dtolist: null,
          id: 15,
          level: 3,
          name: "河南日报"
        }, {
          children_category_dtolist: null,
          id: 16,
          level: 3,
          name: "厅信息化与软件服务业处"
        }
      ],
      level: 1,
      name: "信息来源",
    },
  )
  db.dicTionaries.create(
    {
      id: "12",
      children_category_dtolist: [
        {
          id: 13,
          name: "新闻资讯",
          parent_id: 12,
          level: 3,
          children_category_dtolist: [
            {
              id: 80,
              name: "1111",
              parent_id: 13,
              level: 4,
              children_category_dtolist: null
            }
          ]
        },
        {
          id: 14,
          name: "通知公告",
          parent_id: 12,
          level: 3,
          children_category_dtolist: null
        },
      ],
      level: 1,
      name: "信息来源",
    },
  )

  db.classInfo.create(
    {
      id: "1",
      children_category_dtolist: [
        {
          "id": 10,
          "name": "信息来源",
          "parent_id": 4,
          "level": 2,
          "orders": 1,
          "status": 0,
          "children_category_dtolist": null
        },
        {
          "id": 12,
          "name": "资讯栏目",
          "parent_id": 4,
          "level": 2,
          "orders": 2,
          "status": 0,
          "children_category_dtolist": null
        },
        {
          "id": 22,
          "name": "畅聊早餐会行业",
          "parent_id": 4,
          "level": 2,
          "orders": 5,
          "status": 0,
          "children_category_dtolist": null
        },
        {
          "id": 23,
          "name": "万人助万企分类",
          "parent_id": 4,
          "level": 2,
          "orders": 6,
          "status": 0,
          "children_category_dtolist": null
        },
        {
          "id": 31,
          "name": "万人助万企文章来源",
          "parent_id": 4,
          "level": 2,
          "orders": 7,
          "status": 0,
          "children_category_dtolist": null
        },
        {
          "id": 56,
          "name": "政策分类",
          "parent_id": 4,
          "level": 2,
          "orders": 8,
          "status": 0,
          "children_category_dtolist": null
        },
        {
          "id": 58,
          "name": "政策发文地区",
          "parent_id": 4,
          "level": 2,
          "orders": 10,
          "status": 0,
          "children_category_dtolist": null
        },
        {
          "id": 82,
          "name": "企业一站式分类",
          "parent_id": 4,
          "level": 2,
          "orders": 11,
          "status": 0,
          "children_category_dtolist": null
        },
        {
          "id": 86,
          "name": "法律法规分类",
          "parent_id": 4,
          "level": 2,
          "orders": 12,
          "status": 0,
          "children_category_dtolist": null
        },
        {
          "id": 97,
          "name": "产业链供需分类",
          "parent_id": 4,
          "level": 2,
          "orders": 13,
          "status": 3,
          "children_category_dtolist": null
        },
        {
          "id": 120,
          "name": "诉求响应常见问题分类",
          "parent_id": 4,
          "level": 2,
          "orders": 15,
          "status": 0,
          "children_category_dtolist": null
        },
        {
          "id": 125,
          "name": "诉求响应具体问题分类",
          "parent_id": 4,
          "level": 2,
          "orders": 16,
          "status": 0,
          "children_category_dtolist": null
        },
        {
          "id": 180,
          "name": "政策发文部门",
          "parent_id": 4,
          "level": 2,
          "orders": 17,
          "status": 0,
          "children_category_dtolist": null
        },
        {
          "id": 181,
          "name": "政策责任部门",
          "parent_id": 4,
          "level": 2,
          "orders": 18,
          "status": 0,
          "children_category_dtolist": null
        },
        {
          "id": 204,
          "name": "政策协同部门",
          "parent_id": 4,
          "level": 2,
          "orders": 20,
          "status": 0,
          "children_category_dtolist": null
        }
      ],
      level: 1,
      name: "信息来源",
    }
  )

}


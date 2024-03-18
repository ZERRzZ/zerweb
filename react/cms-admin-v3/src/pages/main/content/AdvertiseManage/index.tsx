import { MyFormItems } from "@/components/MyForm";
import MyTable, { MyTableAction, MyTableUrl } from "@/components/MyTable";
import { DeleteOutlined, DownOutlined, ExportOutlined, ImportOutlined, PlusOutlined, UpOutlined } from "@ant-design/icons";

const ListPage: React.FC = () => {
  const queryFormItems: MyFormItems[] = [
    {
      "type": "text",
      "item": {
        "name": "job_title_like_",
        "label": "职位名称",
        "rules": []
      },
      "option": {}
    },
    {
      "type": "text",
      "item": {
        "name": "location_like_",
        "label": "地点",
        "rules": []
      },
      "option": {}
    },
    {
      "type": "text",
      "item": {
        "name": "org_name_like_",
        "label": "公司名称",
        "rules": []
      },
      "option": {}
    }
  ];
  const columns = [
    {
      "title": "职位名称",
      "dataIndex": "job_title",
      "key": "job_title",
      "option": {
        "renderType": "link"
      }
    },
    {
      "title": "地点",
      "dataIndex": "location",
      "key": "location",
      "option": ""
    },
    {
      "title": "人数",
      "dataIndex": "number",
      "key": "number",
      "option": ""
    },
    {
      "title": "发布时间",
      "dataIndex": "publish_time",
      "key": "publish_time",
      "option": ""
    },
    {
      "title": "公司名称",
      "dataIndex": "org_name",
      "key": "org_name",
      "option": ""
    },
    {
      "title": "状态",
      "dataIndex": "status_name",
      "key": "status_name",
      "option": {
        "renderType": "tag"
      }
    }
  ];
  const addFormItems: MyFormItems[] = [
    {
      "type": "text",
      "item": {
        "name": "job_title",
        "label": "职位名称",
        "rules": [
          {
            "required": true,
            "message": "请输入"
          }
        ]
      },
      "option": {}
    },
    {
      "type": "text",
      "item": {
        "name": "location",
        "label": "地点",
        "rules": [
          {
            "required": true,
            "message": "请输入"
          }
        ]
      },
      "option": {}
    },
    {
      "type": "number",
      "item": {
        "name": "number",
        "label": "人数",
        "rules": [
          {
            "required": true,
            "message": "请输入"
          }
        ]
      },
      "option": {}
    },
    {
      "type": "date",
      "item": {
        "name": "publish_time",
        "label": "发布时间",
        "rules": [
          {
            "required": true,
            "message": "请输入"
          }
        ]
      },
      "option": {}
    },
    {
      "type": "text",
      "item": {
        "name": "org_name",
        "label": "公司名称",
        "rules": [
          {
            "required": true,
            "message": "请输入"
          }
        ]
      },
      "option": {}
    },
    {
      "type": "editor",
      "item": {
        "name": "content",
        "label": "内容",
        "rules": []
      },
      "option": {}
    },
    {
      "type": "myDocUpload",
      "item": {
        "name": "file",
        "label": "附件",
        "rules": [
          {
            "required": true,
            "message": "请输入"
          }
        ],
        "tooltip": '支持 doc, docx, ppt, pptx, xls, xlsx, pdf 等格式'
      },
      "option": {
      }
    }
  ];
  const headerActions: MyTableAction[] = [
    {
      "title": "新增",
      "key": "add",
      "type": "btn",
      "icon": <PlusOutlined />,
      "condition": {},
      "handler": {
        "formItems": addFormItems,
        "showType": "drawer"
      }
    },
    {
      "title": "批量提交",
      "key": "submitBatch",
      "isBatch": true,
      "type": "btn",
      "condition": {
        "values": {
          "status": [
            "0",
            "3",
            "4",
            "5"
          ]
        }
      },
      "handler": {
        "pick": [
          "id"
        ],
        "params": {
          "status": "1"
        },
        "requestUrl": "changeStatusBatch"
      }
    },
    {
      "title": "批量审核",
      "key": "checkBatch",
      "isBatch": true,
      "type": "btn",
      "condition": {
        "values": {
          "status": [
            "1"
          ]
        }
      },
      "handler": {
        "pick": [
          "id"
        ],
        "params": {
          "status": "2"
        },
        "requestUrl": "changeStatusBatch"
      }
    },
    {
      "title": "批量驳回",
      "key": "rejectBatch",
      "isBatch": true,
      "type": "btn",
      "condition": {
        "values": {
          "status": [
            "1"
          ]
        }
      },
      "handler": {
        "pick": [
          "id"
        ],
        "params": {
          "status": "3"
        },
        "requestUrl": "changeStatusBatch"
      }
    },
    {
      "title": "批量下线",
      "key": "offlineBatch",
      "isBatch": true,
      "type": "confirmBtn",
      "condition": {
        "values": {
          "status": [
            "2"
          ]
        }
      },
      "handler": {
        "pick": [
          "id"
        ],
        "params": {
          "status": "4"
        },
        "requestUrl": "changeStatusBatch"
      }
    },
    {
      "title": "批量撤回",
      "key": "withdrawBatch",
      "isBatch": true,
      "type": "confirmBtn",
      "condition": {
        "values": {
          "status": [
            "1"
          ]
        }
      },
      "handler": {
        "pick": [
          "id"
        ],
        "params": {
          "status": "5"
        },
        "requestUrl": "changeStatusBatch"
      }
    },
    {
      "title": "批量删除",
      "key": "deleteBatch",
      "isBatch": true,
      "type": "confirmBtn",
      "condition": {},
      "handler": {
        "pick": [
          "id"
        ]
      }
    }
  ]
  const itemActions: MyTableAction[] = [
    {
      "title": "查看",
      "key": "view",
      "type": "btn",
      "condition": {},
      "handler": {
        "showType": "editForm"
      }
    },
    {
      "title": "编辑",
      "key": "edit",
      "type": "btn",
      "condition": {
        "values": {
          "status": [
            "0",
            "3",
            "4",
            "5"
          ]
        }
      },
      "handler": {
        "formItems": addFormItems,
        "showType": "drawer",
        "pick": [
          "id"
        ],
        "requireDetail": true
      }
    },
    {
      "title": "提交",
      "key": "submit",
      "type": "btn",
      "condition": {
        "values": {
          "status": [
            "0",
            "3",
            "4",
            "5"
          ]
        }
      },
      "handler": {
        "pick": [
          "id"
        ],
        "params": {
          "status": "1"
        },
        "requestUrl": "changeStatus"
      }
    },
    {
      "title": "审核",
      "key": "check",
      "type": "btn",
      "condition": {
        "values": {
          "status": [
            "1"
          ]
        }
      },
      "handler": {
        "pick": [
          "id"
        ],
        "params": {
          "status": "2"
        },
        "requestUrl": "changeStatus"
      }
    },
    {
      "title": "驳回",
      "key": "reject",
      "type": "btn",
      "condition": {
        "values": {
          "status": [
            "1"
          ]
        }
      },
      "handler": {
        "pick": [
          "id"
        ],
        "params": {
          "status": "3"
        },
        "requestUrl": "changeStatus"
      }
    },
    {
      "title": "下线",
      "key": "offline",
      "type": "confirmBtn",
      "condition": {
        "values": {
          "status": [
            "2"
          ]
        }
      },
      "handler": {
        "pick": [
          "id"
        ],
        "params": {
          "status": "4"
        },
        "requestUrl": "changeStatus"
      }
    },
    {
      "title": "撤回",
      "key": "withdraw",
      "type": "confirmBtn",
      "condition": {
        "values": {
          "status": [
            "1"
          ]
        }
      },
      "handler": {
        "pick": [
          "id"
        ],
        "params": {
          "status": "5"
        },
        "requestUrl": "changeStatus"
      }
    },
    {
      "title": "删除",
      "key": "delete",
      "type": "confirmBtn",
      "condition": {
        "values": {
          "status": [
            "0",
            "3",
            "4",
            "5"
          ]
        }
      },
      "handler": {
        "pick": [
          "id"
        ]
      }
    }
  ];
  const requestConfig = {
    list: { url: '/1/ms/advertise/page_list', method: 'get' } as MyTableUrl,
    add: { url: '/1/ms/advertise/add', method: 'post' } as MyTableUrl,
    edit: { url: '/1/ms/advertise/update', method: 'post' } as MyTableUrl,
    delete: { url: '/1/ms/advertise/delete', method: 'post' } as MyTableUrl,
    deleteBatch: { url: '/1/ms/advertise/batch_delete', method: 'post' } as MyTableUrl,
    changeStatus: { url: '/1/ms/advertise/change_status', method: 'post' } as MyTableUrl,
    changeStatusBatch: { url: '/1/ms/advertise/batch_change_status', method: 'post' } as MyTableUrl,
    detail: { url: '/1/ms/advertise/get', method: 'get' } as MyTableUrl,
    export: { url: '/1/ms/advertise/export', method: 'get' } as MyTableUrl,
    import: { url: '/1/ms/advertise/import', method: 'post' } as MyTableUrl,
  }
  const tabConfig = {
    "name": "status",
    "tabs": [
      {
        "label": "所有",
        "key": ""
      },
      {
        "label": "草稿",
        "key": "0"
      },
      {
        "label": "待审核",
        "key": "1"
      },
      {
        "label": "已发布",
        "key": "2"
      },
      {
        "label": "已驳回",
        "key": "3"
      },
      {
        "label": "已下线",
        "key": "4"
      },
      {
        "label": "已撤回",
        "key": "5"
      }
    ],
    "defaultKey": ""
  };
  return <>
    <MyTable
      queryConfig={{ formItems: queryFormItems }}
      tableConfig={{
        columns: columns,
        selectionType: "checkbox",
        rowKey: "id",
        scroll: { x: 1300 }
      }}
      actionConfig={{
        headerActions: headerActions,
        itemActions: itemActions,
      }}
      requestConfig={requestConfig}
      tabConfig={tabConfig}
    />
  </>
}
export default ListPage;
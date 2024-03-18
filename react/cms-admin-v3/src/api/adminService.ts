import http from "../lib/http";
import env from "../constants/env.json";
const host = env.host.adminService;
/** 组件 */
export type Component = {
  /** 分类 */
  category?: string,
  category_name?: string,
  /** 组件配置内容 */
  config_content?: string,
  /** html内容 */
  content?: string,
  /** 创建日期 */
  create_time?: string,
  /** json内容 */
  data_content?: string,
  /** 删除状态0 未删除 1已删除 */
  deleted?: boolean,
  /** 示例数据 */
  ex_data?: string,
  /** 缩略图 */
  ex_image?: string,
  /** id */
  id?: string,
  /** script内容 */
  script_content?: string,
  /** 组件snId */
  sn_id?: string,
  /** style内容 */
  style_content?: string,
  /** 标题 */
  title?: string,
  /** 更新日期 */
  update_time?: string,
};

/** 数组对象标识 */
export type ObjectIdArray = {
  id_array?: any[],
};

/** 单一对象标识 */
export type ObjectId = {
  id?: any,
};

export type PageList<T> = {
  list?: T[],
  total?: number,
};

/** 组件 */
export type DataTemplate = {
  /** 内容 */
  content?: string,
  /** 创建日期 */
  create_time?: string,
  /** 删除状态0 未删除 1已删除 */
  deleted?: boolean,
  /** id */
  id?: string,
  /** 标题 */
  title?: string,
  /** 更新日期 */
  update_time?: string,
};

/** 文档管理系统文档信息 */
export type DocDTO = {
  /** 文档数据内容，后台回显 */
  current_data_doc_content?: DocContent,
  /** 文档内容，后台回显 */
  current_doc_content?: DocContent,
  /** 文档内容，新增或者更新时使用 */
  doc_content?: DocContent,
  /** 文档元数据信息 */
  doc_metadata?: DocMetadata,
  /** 文档数据内容,已发布内容 */
  publish_data_doc_content?: DocContent,
  /** 文档内容,已发布内容 */
  publish_doc_content?: DocContent,
};

/** 文档管理系统ID参数模型 */
export type DocParamDTO = {
  /** 文档元数据id */
  id?: string[],
  /** 文档元数据sn_id */
  sn_id?: string[],
  /** 状态 0:待发布 1:发布 */
  status?: number,
};

/** 布局 */
export type Layout = {
  /** 分类 */
  category?: string,
  category_name?: string,
  /** 布局内容 */
  content?: string,
  /** 创建日期 */
  create_time?: string,
  /** 删除状态0 未删除 1已删除 */
  deleted?: boolean,
  /** 描述 */
  description?: string,
  /** 缩略图 */
  ex_image?: string,
  /** id */
  id?: string,
  /** 布局内容 */
  layout_content?: LayoutContent,
  /** 名称 */
  name?: string,
  /** script内容 */
  script?: string,
  /** snId */
  sn_id?: string,
  /** style内容 */
  style?: string,
  /** 更新日期 */
  update_time?: string,
};

/** 行为日志 */
export type BehaviorLog = {
  /** 行为名称 */
  action?: string,
  /** 行为ID */
  action_id?: string,
  /** 创建时间 */
  create_time?: string,
  /** 一级分类ID */
  first_category_id?: string,
  /** 一级分类名称 */
  first_category_name?: string,
  /** ID */
  id?: string,
  /** 操作内容 */
  operation_content?: string,
  /** 操作时间 */
  operation_time?: string,
  /** 操作人ID */
  operator_id?: string,
  /** 操作人信息 */
  operator_info?: string,
  /** 操作人IP地址 */
  operator_ip?: string,
  /** 操作人名称 */
  operator_name?: string,
  /** 二级分类ID */
  second_category_id?: string,
  /** 二级分类名称 */
  second_category_name?: string,
  /** 对象ID */
  target_id?: string,
  /** 对象名称 */
  target_name?: string,
  /** 对象类型 */
  target_type?: string,
  /** 三级分类ID */
  third_category_id?: string,
  /** 三级分类名称 */
  third_category_name?: string,
};

/** 模块 */
export type Module = {
  /** 分类 */
  category?: string,
  /** 分类名称 */
  category_name?: string,
  /** component id */
  component_id?: string,
  /** component name */
  component_name?: string,
  /** 创建日期 */
  create_time?: string,
  /** 数据 */
  data?: string,
  /** 删除状态0 未删除 1已删除 */
  deleted?: boolean,
  /** id */
  id?: string,
  /** 名称 */
  name?: string,
  /** 页面id */
  page_id?: string,
  /** 模块snId */
  sn_id?: string,
  /** module 状态: 0 待发布 1 已发布 2 下线 */
  status?: string,
  status_name?: string,
  /** 类型 */
  type?: number,
  /** 更新日期 */
  update_time?: string,
};

/** 模块 */
export type ModuleInfoDTO = {
  /** 分类 */
  category?: string,
  /** 分类名称 */
  category_name?: string,
  /** component id */
  component_id?: string,
  /** component name */
  component_name?: string,
  /** 创建日期 */
  create_time?: string,
  /** 数据 */
  data?: string,
  /** 删除状态0 未删除 1已删除 */
  deleted?: boolean,
  /** id */
  id?: string,
  /** 名称 */
  name?: string,
  /** 页面id */
  page_id?: string,
  /** 页面标题 */
  page_title?: string,
  /** 模块snId */
  sn_id?: string,
  /** module 状态: 0 待发布 1 已发布 2 下线 */
  status?: string,
  status_name?: string,
  /** 类型 */
  type?: number,
  /** 更新日期 */
  update_time?: string,
  /** 版本号 */
  version?: string,
};

/** 模块数据 */
export type ModuleDataDTO = {
  /** 渲染后数据 */
  content?: string,
  /** 数据 */
  data?: string,
  /** html内容 */
  html?: string,
  /** script内容 */
  script?: string,
  /** style内容 */
  style?: string,
};

/** 对象状态 */
export type ObjectStatus = {
  id?: any,
  status?: any,
};

/** 新闻 */
export type News = {
  category?: string,
  category_name?: string,
  content?: string,
  create_time?: string,
  create_user_id?: string,
  creator?: string,
  deleted?: boolean,
  id?: string,
  image?: string,
  keyword?: string,
  orders?: string,
  plan_publish_time?: string,
  publish_time?: string,
  source?: string,
  source_name?: string,
  status?: string,
  status_name?: string,
  title?: string,
  update_time?: string,
  /** 浏览量 */
  views?: string,
};

/** 对象数组状态 */
export type ObjectArrayStatus = {
  id_array?: any[],
  status?: any,
};

/** 页面 */
export type Page = {
  /** 分类 */
  category?: string,
  category_name?: string,
  /** 页面内容 */
  content?: string,
  /** 创建日期 */
  create_time?: string,
  /** 删除状态0 未删除 1已删除 */
  deleted?: boolean,
  /** 缩略图 */
  ex_image?: string,
  /** 页面head内容 */
  head?: string,
  /** id */
  id?: string,
  /** layout id */
  layout_id?: string,
  /** 页面script内容 */
  script?: string,
  /** 页面snId */
  sn_id?: string,
  status_name?: string,
  /** 页面style内容 */
  style?: string,
  /** 页面标题 */
  title?: string,
  /** 更新日期 */
  update_time?: string,
};

/** 页面 */
export type PageOptionDTO = {
  /** id */
  id?: string,
  /** 页面标题 */
  title?: string,
};

/** 页面 */
export type WebsiteConfig = {
  /** 网站配置内容 */
  content?: string,
  /** id */
  id?: string,
  /** 网站snId */
  sn_id?: string,
};

/** 分类 */
export type Category = {
  /** 当前层级的所有子层级，子层级包含其下所属层级 */
  children?: Category[],
  /** 分类编码 */
  code: string,
  /** 分类创建日期 */
  create_time?: string,
  /** 分类删除状态0 未删除 1已删除 */
  deleted?: boolean,
  /** 分类id(修改时必传) */
  id?: string,
  /** 分类层级 */
  level?: number,
  /** 分类名称 */
  name: string,
  /** 分类排序序号 */
  orders?: number,
  /** 分类父类id */
  parent_id: string,
  /** 分类状态0 发布 1 未审核 */
  status?: string,
  /** 分类更新日期 */
  update_time?: string,
};

/** option */
export type OptionModel = {
  /** 子层级 */
  children?: OptionModel[],
  label?: string,
  /** 是否为叶子结点 */
  leaf?: boolean,
  /** 名称 */
  title?: string,
  /** 目标值 */
  value?: string,
};

/** 模型描述简要信息 */
export type ModelMetaPO = {
  /** 创建时间 */
  create_time?: string,
  /** 说明 */
  description: string,
  /** ID */
  id?: string,
  meta_data?: string,
  /** 名称 */
  name: string,
  /** 状态 */
  status?: string,
  /** 更新时间 */
  update_time?: string,
};

/** 模型描述详细信息 */
export type ModelMeta = {
  /** 说明 */
  description?: string,
  /** 表描述 */
  model_table: ModelTable,
  /** 名称 */
  name: string,
  /** 属性描述描述 */
  property_meta_list: ModelPropertyMeta[],
};

/** 模型配置信息 */
export type ModelConfig = {
  action_config?: string,
  api_config?: string,
  form_config?: string,
  id?: string,
  list_config?: string,
  query_config?: string,
  tab_config?: string,
};

/** 模型配置信息 */
export type ScreenConfig = {
  alias?: string,
  content?: string,
  create_time?: string,
  id?: string,
  title?: string,
  update_time?: string,
};

/** 字典 */
export type Dictionary = {
  /** 字典项列表 */
  children?: DictionaryItem[],
  /** 编码 */
  code?: string,
  /** 创建时间 */
  create_time?: string,
  /** 是否删除 */
  deleted?: boolean,
  /** 描述 */
  description?: string,
  /** id */
  id?: string,
  /** 名称 */
  name?: string,
  /** 状态 */
  status?: string,
  /** 更新时间 */
  update_time?: string,
};

/** 字典项 */
export type DictionaryItem = {
  /** 创建时间 */
  create_time?: string,
  /** 是否删除 */
  deleted?: boolean,
  /** 描述 */
  description?: string,
  /** 字典id */
  dic_id?: string,
  /** id */
  id?: string,
  /** 名称 */
  name?: string,
  /** 排序 */
  orders?: number,
  /** 状态 */
  status?: string,
  /** 更新时间 */
  update_time?: string,
  /** 字典项值 */
  value?: string,
};

/** 系统操作 */
export type Action = {
  /** 别名 */
  alias?: string,
  /** id */
  id?: string,
  /** 名称 */
  name?: string,
};

/** 系统资源 */
export type Resource = {
  /** 资源所在的应用id */
  app_id?: string,
  /** 创建时间 */
  create_time?: Timestamp,
  /** 是否删除 */
  deleted?: boolean,
  /** 组名 */
  group?: string,
  /** id */
  id?: string,
  /** 资源标识 */
  identity?: string,
  /** 资源名称 */
  name?: string,
  /** 域名 */
  namespace?: string,
  /** 所属者唯一标识（id.type.app_id） */
  owner_id?: string,
  /** 类型 */
  type?: number,
  /** 更新时间 */
  update_time?: Timestamp,
};

/** 系统角色 */
export type Role = {
  /** 别名 */
  alias?: string,
  /** 角色所在的应用id */
  app_id?: string,
  /** 创建时间 */
  create_time?: Timestamp,
  /** 是否删除 */
  deleted?: boolean,
  /** 描述 */
  description?: string,
  /** id */
  id?: string,
  /** 角色名称 */
  name?: string,
  /** 所属者唯一标识（id.type.app_id） */
  owner_id?: string,
  /** 类型 */
  type?: number,
  /** 更新时间 */
  update_time?: Timestamp,
};

/** 角色权限更新对象 */
export type RoleAuthorityUpdateDTO = {
  /** 添加的权限列表 */
  add_authority?: AuthorityDTO[],
  /** 删除的权限列表 */
  delete_authority?: AuthorityDTO[],
  /** 角色id */
  role_id?: string,
};

/** 角色权限关系 */
export type RoleAuthority = {
  /** 操作id */
  action_id?: string,
  /** 资源id */
  resource_id?: string,
  /** 角色id */
  role_id?: string,
};

export type RoleAuthShowDTO = {
  has_list?: Resource[],
  has_not_list?: Resource[],
};

/** 对象权限更新对象 */
export type SubjectAuthorityDTO = {
  /** 添加的权限列表 */
  add_authority?: AuthorityDTO[],
  /** 删除的权限列表 */
  delete_authority?: AuthorityDTO[],
  /** 组织id */
  org_id?: string,
  /** 对象id */
  subject_id?: string,
};

/** 操作者权限关系 */
export type SubjectAuthority = {
  /** 操作id */
  action_id?: string,
  /** 组织 */
  org_id?: string,
  /** 资源id */
  resource_id?: string,
  /** 操作者唯一标识(用户或者应用) */
  subject_id?: string,
};

export type UserAuthDTO = {
  resource_list?: Resource[],
  subject_role_list?: SubjectRole[],
};

export type CurrentUserAuth = {
  res_identity?: string[],
  role_alias?: string[],
};

/** 操作者角色关系 */
export type SubjectRole = {
  /** 创建时间 */
  create_time?: Timestamp,
  /** 组织 */
  org_id?: string,
  /** 角色id */
  role_id?: string,
  /** 操作者唯一标识(用户或者应用) */
  subject_id?: string,
};

export type RoleSubjectUpdateDTO = {
  /** 添加对象的列表 */
  add_items?: string[],
  /** 删除对象的列表 */
  delete_items?: string[],
  /** 组织id */
  org_id?: string,
  /** 角色id */
  role_id?: string,
};

/** 用户角色更新对象 */
export type SubjectRoleDTO = {
  /** 添加的角色列表 */
  add_role?: string[],
  /** 删除的角色列表 */
  delete_role?: string[],
  /** 组织id */
  org_id?: string,
  /** 对象id */
  subject_id?: string,
};

export type QuartzJob = {
  create_by?: string,
  create_time?: string,
  cron_expression?: string,
  deleted?: boolean,
  description?: string,
  id?: string,
  job_class_name?: string,
  parameter?: string,
  status?: number,
  update_time?: string,
};

/** 文件 */
export type SysFile = {
  content_type?: string,
  create_time?: string,
  deleted?: boolean,
  id?: string,
  name?: string,
  need_login?: boolean,
  storage_type?: number,
  third_party_id?: string,
  title?: string,
  update_time?: string,
  url?: string,
};

/** 系统用户 */
export type User = {
  /** 账号 */
  account?: string,
  /** 创建时间 */
  create_time?: Timestamp,
  /** 是否删除 */
  deleted?: boolean,
  /** 用户名 */
  full_name?: string,
  /** ID */
  id?: string,
  /** 手机号 */
  mobile?: string,
  /** 密码 */
  password?: string,
  /** 第三方id */
  third_party_id?: string,
  /** 用户类型 */
  type?: number,
  /** 更新时间 */
  update_time?: Timestamp,
};

/** 用户角色 */
export type UserRoleDTO = {
  role?: Role[],
  user?: User,
};

/** 文件存储位置 */
export type FileLocation = {
  /** 文件唯一标识 */
  id?: string,
  /** 文件存储地址 */
  location?: string,
  /** 文件访问地址 */
  url?: string,
};

/** 文本内容数据 */
export type DocContent = {
  content?: string,
  create_time?: Timestamp,
  deleted?: boolean,
  description?: string,
  doc_metadata_id?: string,
  doc_type?: number,
  ext_content?: string,
  id?: string,
  pic_url?: string,
  status?: number,
  subtitle?: string,
  summary?: string,
  tag?: string,
  title?: string,
  update_time?: Timestamp,
};

/** 文本内容元数据 */
export type DocMetadata = {
  category?: string,
  category_name?: string,
  create_time?: Timestamp,
  current_data_doc_content_id?: string,
  current_doc_content_id?: string,
  current_version?: string,
  deleted?: boolean,
  /** 文档类型 
    JSON(1, "json"),
    HTML(2, "html"),
    DOM_HTML(3, "dom_html"),
    DOM_JSP(4, "dom_jsp"),
    DOM_JSON(5, "dom_json"),
    RICH_TEXT(6, "rich_text") */
  doc_type?: number,
  id?: string,
  publish_data_doc_content_id?: string,
  publish_doc_content_id?: string,
  publish_time?: string,
  publish_version?: string,
  sn_id?: string,
  status?: number,
  status_name?: string,
  template_doc_metadata_id?: string,
  update_time?: Timestamp,
};

/** 布局内容 */
export type LayoutContent = {
  /** 当前层级的所有子层级，子层级包含其下所属层级 */
  children?: LayoutContent[],
  /** 类名 */
  class_name?: string,
  /** 盒子id */
  id?: string,
  /** 样式 */
  style?: string,
};

/** 已发布页面 */
export type PublishPage = {
  /** 模块、组件数据 */
  component_content?: string,
  /** 模块、组件数据-转换字段 */
  component_data_list?: ComponentData[],
  /** 创建日期 */
  create_time?: string,
  /** 是否为当前发布 */
  current_publish?: boolean,
  /** 删除状态0 未删除 1已删除 */
  deleted?: boolean,
  /** id */
  id?: string,
  /** 布局内容 */
  layout_content?: string,
  /** 布局内容-转换字段 */
  layout_content_child?: LayoutContent,
  /** 布局script内容 */
  layout_script?: string,
  /** 布局style内容 */
  layout_style?: string,
  /** 页面内容 */
  page_content?: string,
  /** 页面script内容 */
  page_script?: string,
  /** 页面snId */
  page_sn_id?: string,
  /** 页面style内容 */
  page_style?: string,
  /** 页面head内容 */
  pagehead?: string,
  /** 发布时间 */
  publish_time?: string,
  /** 更新日期 */
  update_time?: string,
  /** 版本号 */
  version?: string,
  /** 网站配置内容 */
  web_config_content?: string,
};

/** 页面 */
export type PageInfoDTO = {
  /** 分类 */
  category?: string,
  category_name?: string,
  /** 页面内容 */
  content?: string,
  /** 创建日期 */
  create_time?: string,
  /** 删除状态0 未删除 1已删除 */
  deleted?: boolean,
  /** 缩略图 */
  ex_image?: string,
  /** 页面head内容 */
  head?: string,
  /** id */
  id?: string,
  /** layout id */
  layout_id?: string,
  /** 页面script内容 */
  script?: string,
  /** 页面snId */
  sn_id?: string,
  status_name?: string,
  /** 页面style内容 */
  style?: string,
  /** 页面标题 */
  title?: string,
  /** 更新日期 */
  update_time?: string,
  /** 版本号 */
  version?: string,
};

/** 模型描述简要信息 */
export type ModelMetaSimplePO = {
  /** 创建时间 */
  create_time?: string,
  /** 说明 */
  description: string,
  /** ID */
  id?: string,
  /** 名称 */
  name: string,
  /** 状态 */
  status?: string,
  /** 更新时间 */
  update_time?: string,
};

/** 表描述 */
export type ModelTable = {
  /** 表别名 */
  as?: string,
  /** 是否自动创建表 */
  auto_create?: boolean,
  /** 默认排序 */
  default_order_by?: string,
  /** 表说明 */
  description?: string,
  /** 插入操作时是否忽略null值 */
  ignore_null_for_insert?: boolean,
  /** 更新操作时是否忽略null值 */
  ignore_null_for_update?: boolean,
  /** 联表语句 */
  join?: string,
  /** 表名 */
  name?: string,
};

/** 模型属性描述 */
export type ModelPropertyMeta = {
  /** 属性说明 */
  description?: string,
  /** 字段描述 */
  model_column?: ModelColumn,
  /** 查询描述 */
  model_query?: ModelQuery,
  /** 属性名称 */
  name: string,
  /** 属性类型 */
  type: string,
};

export type Timestamp = {
  date?: number,
  day?: number,
  hours?: number,
  minutes?: number,
  month?: number,
  nanos?: number,
  seconds?: number,
  time?: string,
  timezone_offset?: number,
  year?: number,
};

export type AuthorityDTO = {
  action_id?: string,
  resource_id?: string,
};

/** 角色权限关系 */
export type RoleAuthorityListDTO = {
  /** 操作对象 */
  action?: Action,
  /** 资源对象 */
  resource?: Resource,
  /** 角色id */
  role_id?: string,
};

export type SubjectAuthrityListDTO = {
  /** 操作对象 */
  action?: Action,
  /** 组织id */
  org_id?: string,
  /** 资源对象 */
  resource?: Resource,
  /** 对象id */
  subject_id?: string,
};

export type FileMetadata = {
  client_id?: string,
  content_type?: string,
  create_time?: string,
  crypt?: boolean,
  deleted?: boolean,
  extension?: string,
  file_name?: string,
  file_size?: string,
  file_type?: string,
  id?: string,
  location?: string,
  metadata?: string,
  need_login?: boolean,
  partial?: boolean,
  show_filename?: boolean,
  show_front?: boolean,
  storage_type?: number,
  update_time?: string,
};

export type ComponentData = {
  /** 组件配置内容 */
  component_config?: string,
  /** 组件html内容 */
  component_content?: string,
  /** 组件json内容 */
  component_data?: string,
  /** 组件 */
  component_id?: string,
  /** 组件script内容 */
  component_script?: string,
  /** 组件style内容 */
  component_style?: string,
  /** 模块数据 */
  module_data?: string,
  /** 模块ID */
  module_id?: string,
};

/** 字段描述 */
export type ModelColumn = {
  /** 是否自增 */
  auto_increment?: boolean,
  /** 转化查询实现类类名 */
  convert_class_name?: string,
  /** 转化来源编码 */
  convert_code?: string,
  /** 转化来源 */
  convert_from?: string,
  /** 字段语句 */
  create_string?: string,
  /** 默认排序 */
  default_order_by?: string,
  /** 是否存在数据库中 */
  exists?: boolean,
  /** 插入时是否忽略 */
  ignore_insert?: boolean,
  /** 列表查询时是否忽略 */
  ignore_list?: boolean,
  /** 查询时是否忽略 */
  ignore_select?: boolean,
  /** 更新时是否忽略 */
  ignore_update?: boolean,
  /** 字符长度 */
  length?: number,
  /** 字段名称 */
  name?: string,
  /** 是否主键 */
  primary_key?: boolean,
  /** 字段类型 */
  type?: string,
};

/** 查询描述 */
export type ModelQuery = {
  /** 是否可以等于查询 */
  allow_equal?: boolean,
  /** 是否可以in查询 */
  allow_in?: boolean,
  /** 是否可以左模糊查询 */
  allow_left_like?: boolean,
  /** 是否可以模糊查询 */
  allow_like?: boolean,
  /** 是否可以模糊或者联合查询 */
  allow_like_or?: boolean,
  /** 是否可以排序 */
  allow_order_by?: boolean,
  /** 是否可以范围查询 */
  allow_range?: boolean,
  /** 是否可以右模糊查询 */
  allow_right_like?: boolean,
  /** 固定值 */
  fixed_value?: string,
  /** 是否必须 */
  required?: boolean,
};

export default {
  cms: {
    component: {
      /** 添加组件 */
      add(data?: Component, signal?: AbortSignal): Promise<boolean> {
        return http({
          url: host + "/1/cms/component/add",
          method: "post",
          headers: { "Content-Type": "application/json" },
          data,
          signal,
        }).then((res) => res.data.data);
      },
      /** 批量逻辑删除 */
      batchDelete(
        data?: ObjectIdArray,
        signal?: AbortSignal
      ): Promise<boolean> {
        return http({
          url: host + "/1/cms/component/batch_delete",
          method: "post",
          headers: { "Content-Type": "application/json" },
          data,
          signal,
        }).then((res) => res.data.data);
      },
      /** 组件预览 */
      componentPreview(
        params: {
          /** id */
          id: string,
        },
        signal?: AbortSignal
      ): Promise<string> {
        return http({
          url: host + "/1/cms/component/component_preview",
          method: "post",
          headers: { "Content-Type": "application/json" },
          params,
          signal,
        }).then((res) => res.data.data);
      },
      /** 逻辑删除 */
      delete(data?: ObjectId, signal?: AbortSignal): Promise<boolean> {
        return http({
          url: host + "/1/cms/component/delete",
          method: "post",
          headers: { "Content-Type": "application/json" },
          data,
          signal,
        }).then((res) => res.data.data);
      },
      /** 获取组件 by id */
      get(
        params: {
          /** id */
          id: string,
        },
        signal?: AbortSignal
      ): Promise<Component> {
        return http({
          url: host + "/1/cms/component/get",
          method: "get",
          headers: { "Content-Type": "application/json" },
          params,
          signal,
        }).then((res) => res.data.data);
      },
      /** 分页查询 */
      pageList(
        params: {
          /** 查询条件 */
          query?: string,
          /** 页码 */
          page_no: number,
          /** 数量 */
          page_size: number,
        },
        signal?: AbortSignal
      ): Promise<PageList<Component>> {
        return http({
          url: host + "/1/cms/component/page_list",
          method: "get",
          headers: { "Content-Type": "application/json" },
          params,
          signal,
        }).then((res) => res.data.data);
      },
      /** 获取组件 */
      qget(
        params: {
          /** 查询条件 */
          query?: string,
        },
        signal?: AbortSignal
      ): Promise<Component> {
        return http({
          url: host + "/1/cms/component/qget",
          method: "get",
          headers: { "Content-Type": "application/json" },
          params,
          signal,
        }).then((res) => res.data.data);
      },
      /** 更新组件 */
      update(data?: Component, signal?: AbortSignal): Promise<boolean> {
        return http({
          url: host + "/1/cms/component/update",
          method: "post",
          headers: { "Content-Type": "application/json" },
          data,
          signal,
        }).then((res) => res.data.data);
      },
    },
    dataTemplate: {
      /** 新增 */
      add(data?: DataTemplate, signal?: AbortSignal): Promise<string> {
        return http({
          url: host + "/1/cms/data_template/add",
          method: "post",
          headers: { "Content-Type": "application/json" },
          data,
          signal,
        }).then((res) => res.data.data);
      },
      /** 批量逻辑删除 */
      batchDelete(
        data?: ObjectIdArray,
        signal?: AbortSignal
      ): Promise<boolean> {
        return http({
          url: host + "/1/cms/data_template/batch_delete",
          method: "post",
          headers: { "Content-Type": "application/json" },
          data,
          signal,
        }).then((res) => res.data.data);
      },
      /** 逻辑删除 */
      delete(data?: ObjectId, signal?: AbortSignal): Promise<boolean> {
        return http({
          url: host + "/1/cms/data_template/delete",
          method: "post",
          headers: { "Content-Type": "application/json" },
          data,
          signal,
        }).then((res) => res.data.data);
      },
      /** 根据主键进行查询 */
      get(
        params: {
          /** id */
          id: string,
        },
        signal?: AbortSignal
      ): Promise<DataTemplate> {
        return http({
          url: host + "/1/cms/data_template/get",
          method: "get",
          headers: { "Content-Type": "application/json" },
          params,
          signal,
        }).then((res) => res.data.data);
      },
      /** 列表查询 */
      list(
        params: {
          /** 查询条件 */
          query?: string,
        },
        signal?: AbortSignal
      ): Promise<DataTemplate[]> {
        return http({
          url: host + "/1/cms/data_template/list",
          method: "get",
          headers: { "Content-Type": "application/json" },
          params,
          signal,
        }).then((res) => res.data.data);
      },
      /** 分页查询 */
      pageList(
        params: {
          /** 查询条件 */
          query?: string,
          /** 页码 */
          page_no: number,
          /** 数量 */
          page_size: number,
        },
        signal?: AbortSignal
      ): Promise<PageList<DataTemplate>> {
        return http({
          url: host + "/1/cms/data_template/page_list",
          method: "get",
          headers: { "Content-Type": "application/json" },
          params,
          signal,
        }).then((res) => res.data.data);
      },
      /** 根据条件进行查询 */
      qget(
        params: {
          /** 查询条件 */
          query?: string,
        },
        signal?: AbortSignal
      ): Promise<DataTemplate> {
        return http({
          url: host + "/1/cms/data_template/qget",
          method: "get",
          headers: { "Content-Type": "application/json" },
          params,
          signal,
        }).then((res) => res.data.data);
      },
      /** 更新 */
      update(data?: DataTemplate, signal?: AbortSignal): Promise<boolean> {
        return http({
          url: host + "/1/cms/data_template/update",
          method: "post",
          headers: { "Content-Type": "application/json" },
          data,
          signal,
        }).then((res) => res.data.data);
      },
    },
    doc: {
      /** 添加文档 */
      add(data?: DocDTO, signal?: AbortSignal): Promise<DocDTO> {
        return http({
          url: host + "/1/cms/doc/add",
          method: "post",
          headers: { "Content-Type": "application/json" },
          data,
          signal,
        }).then((res) => res.data.data);
      },
      /** 取消发布 */
      changeStatus(data?: DocParamDTO, signal?: AbortSignal): Promise<boolean> {
        return http({
          url: host + "/1/cms/doc/change_status",
          method: "post",
          headers: { "Content-Type": "application/json" },
          data,
          signal,
        }).then((res) => res.data.data);
      },
      /** 逻辑删除 */
      delete(data?: DocParamDTO, signal?: AbortSignal): Promise<boolean> {
        return http({
          url: host + "/1/cms/doc/delete",
          method: "post",
          headers: { "Content-Type": "application/json" },
          data,
          signal,
        }).then((res) => res.data.data);
      },
      /** 获取文档 */
      get(
        params: {
          /** 文档id */
          id?: string,
          /** 文档snid */
          sn_id?: string,
        },
        signal?: AbortSignal
      ): Promise<DocDTO> {
        return http({
          url: host + "/1/cms/doc/get",
          method: "get",
          headers: { "Content-Type": "application/json" },
          params,
          signal,
        }).then((res) => res.data.data);
      },
      /** 分页查询 */
      pageList(
        params: {
          /** 分类 */
          category?: string,
          /** 类型 0：全部 1：当前 2：发布 */
          type?: number,
          /** 页码 */
          page_no?: number,
          /** 数量 */
          page_size?: number,
          /** 状态 0 待发布，1 已发布，不传  所有 */
          status?: number,
        },
        signal?: AbortSignal
      ): Promise<PageList<DocDTO>> {
        return http({
          url: host + "/1/cms/doc/page_list",
          method: "get",
          headers: { "Content-Type": "application/json" },
          params,
          signal,
        }).then((res) => res.data.data);
      },
      /** 发布 */
      publish(data?: DocParamDTO, signal?: AbortSignal): Promise<boolean> {
        return http({
          url: host + "/1/cms/doc/publish",
          method: "post",
          headers: { "Content-Type": "application/json" },
          data,
          signal,
        }).then((res) => res.data.data);
      },
      /** 更新文档 */
      update(data?: DocDTO, signal?: AbortSignal): Promise<DocDTO> {
        return http({
          url: host + "/1/cms/doc/update",
          method: "post",
          headers: { "Content-Type": "application/json" },
          data,
          signal,
        }).then((res) => res.data.data);
      },
    },
    layout: {
      /** 添加布局 */
      add(data?: Layout, signal?: AbortSignal): Promise<boolean> {
        return http({
          url: host + "/1/cms/layout/add",
          method: "post",
          headers: { "Content-Type": "application/json" },
          data,
          signal,
        }).then((res) => res.data.data);
      },
      /** 批量逻辑删除 */
      batchDelete(
        data?: ObjectIdArray,
        signal?: AbortSignal
      ): Promise<boolean> {
        return http({
          url: host + "/1/cms/layout/batch_delete",
          method: "post",
          headers: { "Content-Type": "application/json" },
          data,
          signal,
        }).then((res) => res.data.data);
      },
      /** 逻辑删除 */
      delete(data?: ObjectId, signal?: AbortSignal): Promise<boolean> {
        return http({
          url: host + "/1/cms/layout/delete",
          method: "post",
          headers: { "Content-Type": "application/json" },
          data,
          signal,
        }).then((res) => res.data.data);
      },
      /** 获取布局 by id */
      get(
        params: {
          /** id */
          id: string,
        },
        signal?: AbortSignal
      ): Promise<Layout> {
        return http({
          url: host + "/1/cms/layout/get",
          method: "get",
          headers: { "Content-Type": "application/json" },
          params,
          signal,
        }).then((res) => res.data.data);
      },
      /** 分页查询 */
      pageList(
        params: {
          /** 查询条件 */
          query?: string,
          /** 页码 */
          page_no: number,
          /** 数量 */
          page_size: number,
        },
        signal?: AbortSignal
      ): Promise<PageList<Layout>> {
        return http({
          url: host + "/1/cms/layout/page_list",
          method: "get",
          headers: { "Content-Type": "application/json" },
          params,
          signal,
        }).then((res) => res.data.data);
      },
      /** 更新布局 */
      update(data?: Layout, signal?: AbortSignal): Promise<boolean> {
        return http({
          url: host + "/1/cms/layout/update",
          method: "post",
          headers: { "Content-Type": "application/json" },
          data,
          signal,
        }).then((res) => res.data.data);
      },
    },
    log: {
      /** 获取操作行为列表 */
      actionList(signal?: AbortSignal): Promise<string[]> {
        return http({
          url: host + "/1/cms/log/action_list",
          method: "get",
          headers: { "Content-Type": "application/json" },
          signal,
        }).then((res) => res.data.data);
      },
      /** 操作日志导出成EXCEL接口,请不要传page_size和page_num参数 */
      export(signal?: AbortSignal): Promise<boolean> {
        return http({
          url: host + "/1/cms/log/export",
          method: "get",
          headers: { "Content-Type": "application/json" },
          signal,
        }).then((res) => res.data.data);
      },
      /** 最近登录时间 */
      lastLogin(signal?: AbortSignal): Promise<BehaviorLog> {
        return http({
          url: host + "/1/cms/log/last_login",
          method: "get",
          headers: { "Content-Type": "application/json" },
          signal,
        }).then((res) => res.data.data);
      },
      /** 系统动态分页查询 */
      list(
        params: {
          /** 查询条件 */
          query?: string,
          /** 页码 */
          page_no: number,
          /** 数量 */
          page_size: number,
        },
        signal?: AbortSignal
      ): Promise<PageList<BehaviorLog>> {
        return http({
          url: host + "/1/cms/log/list",
          method: "get",
          headers: { "Content-Type": "application/json" },
          params,
          signal,
        }).then((res) => res.data.data);
      },
      /** 日志记录接口 */
      record(
        params: {
          /** 行为id： 行为id： 1 登录；9 访问 10 导出 11 登出 */
          action_id: number,
          /** 页面对应的id：由前端定义每个页面对应一个id  1-30为后台记录使用 */
          target_id?: number,
          /** 页面对应的名称：由前端定义每个页面对应一个名称 */
          target_name: string,
          /** 一级分类id：默认不需要传 */
          first_category_id?: string,
          /** 一级分类名称：默认不需要传 */
          first_category_name?: string,
          /** 二级分类id：默认不需要传 */
          sec_category_id?: string,
          /** 二级分类名称：默认不需要传 */
          sec_category_name?: string,
        },
        signal?: AbortSignal
      ): Promise<boolean> {
        return http({
          url: host + "/1/cms/log/record",
          method: "get",
          headers: { "Content-Type": "application/json" },
          params,
          signal,
        }).then((res) => res.data.data);
      },
    },
    module: {
      /** 添加模块 */
      add(data?: Module, signal?: AbortSignal): Promise<string> {
        return http({
          url: host + "/1/cms/module/add",
          method: "post",
          headers: { "Content-Type": "application/json" },
          data,
          signal,
        }).then((res) => res.data.data);
      },
      /** 批量逻辑删除 */
      batchDelete(
        data?: ObjectIdArray,
        signal?: AbortSignal
      ): Promise<boolean> {
        return http({
          url: host + "/1/cms/module/batch_delete",
          method: "post",
          headers: { "Content-Type": "application/json" },
          data,
          signal,
        }).then((res) => res.data.data);
      },
      /** 清楚模块缓存-重新加载模块数据 */
      clearCache(data?: ObjectId, signal?: AbortSignal): Promise<boolean> {
        return http({
          url: host + "/1/cms/module/clear_cache",
          method: "post",
          headers: { "Content-Type": "application/json" },
          data,
          signal,
        }).then((res) => res.data.data);
      },
      /** 逻辑删除 */
      delete(data?: ObjectId, signal?: AbortSignal): Promise<boolean> {
        return http({
          url: host + "/1/cms/module/delete",
          method: "post",
          headers: { "Content-Type": "application/json" },
          data,
          signal,
        }).then((res) => res.data.data);
      },
      /** 回退 */
      fallback(
        params: {
          /** 页面id */
          id: string,
          /** 发布id */
          publish_id: string,
        },
        signal?: AbortSignal
      ): Promise<boolean> {
        return http({
          url: host + "/1/cms/module/fallback",
          method: "post",
          headers: { "Content-Type": "application/json" },
          params,
          signal,
        }).then((res) => res.data.data);
      },
      /** 获取模块 by id */
      get(
        params: {
          /** id */
          id: string,
        },
        signal?: AbortSignal
      ): Promise<ModuleInfoDTO> {
        return http({
          url: host + "/1/cms/module/get",
          method: "get",
          headers: { "Content-Type": "application/json" },
          params,
          signal,
        }).then((res) => res.data.data);
      },
      /** 获取模块数据 */
      getData(
        params: {
          /** sn_id */
          sn_id: string,
        },
        signal?: AbortSignal
      ): Promise<ModuleDataDTO> {
        return http({
          url: host + "/1/cms/module/get_data",
          method: "get",
          headers: { "Content-Type": "application/json" },
          params,
          signal,
        }).then((res) => res.data.data);
      },
      /** 下线 */
      offline(data?: ObjectStatus, signal?: AbortSignal): Promise<boolean> {
        return http({
          url: host + "/1/cms/module/offline",
          method: "post",
          headers: { "Content-Type": "application/json" },
          data,
          signal,
        }).then((res) => res.data.data);
      },
      /** 上线 */
      online(data?: ObjectStatus, signal?: AbortSignal): Promise<boolean> {
        return http({
          url: host + "/1/cms/module/online",
          method: "post",
          headers: { "Content-Type": "application/json" },
          data,
          signal,
        }).then((res) => res.data.data);
      },
      /** 分页查询 */
      pageList(
        params: {
          /** 查询条件 */
          query?: string,
          /** 页码 */
          page_no: number,
          /** 数量 */
          page_size: number,
        },
        signal?: AbortSignal
      ): Promise<PageList<ModuleInfoDTO>> {
        return http({
          url: host + "/1/cms/module/page_list",
          method: "get",
          headers: { "Content-Type": "application/json" },
          params,
          signal,
        }).then((res) => res.data.data);
      },
      /** 预览 */
      preview(
        params: {
          /** sn_id */
          sn_id: string,
        },
        signal?: AbortSignal
      ): Promise<string> {
        return http({
          url: host + "/1/cms/module/preview",
          method: "post",
          headers: { "Content-Type": "application/json" },
          params,
          signal,
        }).then((res) => res.data.data);
      },
      /** 发布 */
      publish(
        params: {
          /** id */
          id: string,
        },
        signal?: AbortSignal
      ): Promise<boolean> {
        return http({
          url: host + "/1/cms/module/publish",
          method: "post",
          headers: { "Content-Type": "application/json" },
          params,
          signal,
        }).then((res) => res.data.data);
      },
      /** 已发布页面信息 */
      publishList(
        params: {
          /** sn_id */
          sn_id: string,
          /** 页码 */
          page_no?: number,
          /** 数量 */
          page_size?: number,
        },
        signal?: AbortSignal
      ): Promise<PageList<PublishPage>> {
        return http({
          url: host + "/1/cms/module/publish_list",
          method: "get",
          headers: { "Content-Type": "application/json" },
          params,
          signal,
        }).then((res) => res.data.data);
      },
      /** 获取模块 */
      qget(
        params: {
          /** 查询条件 */
          query?: string,
        },
        signal?: AbortSignal
      ): Promise<ModuleInfoDTO> {
        return http({
          url: host + "/1/cms/module/qget",
          method: "get",
          headers: { "Content-Type": "application/json" },
          params,
          signal,
        }).then((res) => res.data.data);
      },
      /** 更新模块 */
      update(data?: Module, signal?: AbortSignal): Promise<boolean> {
        return http({
          url: host + "/1/cms/module/update",
          method: "post",
          headers: { "Content-Type": "application/json" },
          data,
          signal,
        }).then((res) => res.data.data);
      },
    },
    news: {
      /** 新增 */
      add(data?: News, signal?: AbortSignal): Promise<string> {
        return http({
          url: host + "/1/cms/news/add",
          method: "post",
          headers: { "Content-Type": "application/json" },
          data,
          signal,
        }).then((res) => res.data.data);
      },
      /** 批量逻辑删除 */
      batchDelete(
        data?: ObjectIdArray,
        signal?: AbortSignal
      ): Promise<boolean> {
        return http({
          url: host + "/1/cms/news/batch_delete",
          method: "post",
          headers: { "Content-Type": "application/json" },
          data,
          signal,
        }).then((res) => res.data.data);
      },
      /** 批量下线 */
      batchOffline(
        data?: ObjectArrayStatus,
        signal?: AbortSignal
      ): Promise<boolean> {
        return http({
          url: host + "/1/cms/news/batch_offline",
          method: "post",
          headers: { "Content-Type": "application/json" },
          data,
          signal,
        }).then((res) => res.data.data);
      },
      /** 批量发布 */
      batchPublish(
        data?: ObjectArrayStatus,
        signal?: AbortSignal
      ): Promise<boolean> {
        return http({
          url: host + "/1/cms/news/batch_publish",
          method: "post",
          headers: { "Content-Type": "application/json" },
          data,
          signal,
        }).then((res) => res.data.data);
      },
      /** 批量驳回 */
      batchRefuse(
        data?: ObjectArrayStatus,
        signal?: AbortSignal
      ): Promise<boolean> {
        return http({
          url: host + "/1/cms/news/batch_refuse",
          method: "post",
          headers: { "Content-Type": "application/json" },
          data,
          signal,
        }).then((res) => res.data.data);
      },
      /** 批量提交 */
      batchSubmit(
        data?: ObjectArrayStatus,
        signal?: AbortSignal
      ): Promise<boolean> {
        return http({
          url: host + "/1/cms/news/batch_submit",
          method: "post",
          headers: { "Content-Type": "application/json" },
          data,
          signal,
        }).then((res) => res.data.data);
      },
      /** 批量撤回 */
      batchWithdraw(
        data?: ObjectArrayStatus,
        signal?: AbortSignal
      ): Promise<boolean> {
        return http({
          url: host + "/1/cms/news/batch_withdraw",
          method: "post",
          headers: { "Content-Type": "application/json" },
          data,
          signal,
        }).then((res) => res.data.data);
      },
      /** 取消置顶 */
      cancelToTop(data?: ObjectId, signal?: AbortSignal): Promise<boolean> {
        return http({
          url: host + "/1/cms/news/cancel_to_top",
          method: "post",
          headers: { "Content-Type": "application/json" },
          data,
          signal,
        }).then((res) => res.data.data);
      },
      /** 逻辑删除 */
      delete(data?: ObjectId, signal?: AbortSignal): Promise<boolean> {
        return http({
          url: host + "/1/cms/news/delete",
          method: "post",
          headers: { "Content-Type": "application/json" },
          data,
          signal,
        }).then((res) => res.data.data);
      },
      /** 根据主键进行查询 */
      get(
        params: {
          /** id */
          id: string,
        },
        signal?: AbortSignal
      ): Promise<News> {
        return http({
          url: host + "/1/cms/news/get",
          method: "get",
          headers: { "Content-Type": "application/json" },
          params,
          signal,
        }).then((res) => res.data.data);
      },
      /** 导入 */
      import(data?: FormData, signal?: AbortSignal): Promise<boolean> {
        return http({
          url: host + "/1/cms/news/import",
          method: "post",
          headers: { "Content-Type": "multipart/form-data" },
          data,
          signal,
        }).then((res) => res.data.data);
      },
      /** 列表查询 */
      list(
        params: {
          /** 查询条件 */
          query?: string,
        },
        signal?: AbortSignal
      ): Promise<News[]> {
        return http({
          url: host + "/1/cms/news/list",
          method: "get",
          headers: { "Content-Type": "application/json" },
          params,
          signal,
        }).then((res) => res.data.data);
      },
      /** 下线 */
      offline(data?: ObjectStatus, signal?: AbortSignal): Promise<boolean> {
        return http({
          url: host + "/1/cms/news/offline",
          method: "post",
          headers: { "Content-Type": "application/json" },
          data,
          signal,
        }).then((res) => res.data.data);
      },
      /** 分页查询 */
      pageList(
        params: {
          /** 查询条件 */
          query?: string,
          /** 页码 */
          page_no: number,
          /** 数量 */
          page_size: number,
        },
        signal?: AbortSignal
      ): Promise<PageList<News>> {
        return http({
          url: host + "/1/cms/news/page_list",
          method: "get",
          headers: { "Content-Type": "application/json" },
          params,
          signal,
        }).then((res) => res.data.data);
      },
      /** 发布 */
      publish(data?: ObjectStatus, signal?: AbortSignal): Promise<boolean> {
        return http({
          url: host + "/1/cms/news/publish",
          method: "post",
          headers: { "Content-Type": "application/json" },
          data,
          signal,
        }).then((res) => res.data.data);
      },
      /** 根据条件进行查询 */
      qget(
        params: {
          /** 查询条件 */
          query?: string,
        },
        signal?: AbortSignal
      ): Promise<News> {
        return http({
          url: host + "/1/cms/news/qget",
          method: "get",
          headers: { "Content-Type": "application/json" },
          params,
          signal,
        }).then((res) => res.data.data);
      },
      /** 驳回 */
      refuse(data?: ObjectStatus, signal?: AbortSignal): Promise<boolean> {
        return http({
          url: host + "/1/cms/news/refuse",
          method: "post",
          headers: { "Content-Type": "application/json" },
          data,
          signal,
        }).then((res) => res.data.data);
      },
      /** 提交 */
      submit(data?: ObjectStatus, signal?: AbortSignal): Promise<boolean> {
        return http({
          url: host + "/1/cms/news/submit",
          method: "post",
          headers: { "Content-Type": "application/json" },
          data,
          signal,
        }).then((res) => res.data.data);
      },
      /** 置顶 */
      toTop(data?: ObjectId, signal?: AbortSignal): Promise<boolean> {
        return http({
          url: host + "/1/cms/news/to_top",
          method: "post",
          headers: { "Content-Type": "application/json" },
          data,
          signal,
        }).then((res) => res.data.data);
      },
      /** 更新 */
      update(data?: News, signal?: AbortSignal): Promise<boolean> {
        return http({
          url: host + "/1/cms/news/update",
          method: "post",
          headers: { "Content-Type": "application/json" },
          data,
          signal,
        }).then((res) => res.data.data);
      },
      /** 撤回 */
      withdraw(data?: ObjectStatus, signal?: AbortSignal): Promise<boolean> {
        return http({
          url: host + "/1/cms/news/withdraw",
          method: "post",
          headers: { "Content-Type": "application/json" },
          data,
          signal,
        }).then((res) => res.data.data);
      },
    },
    page: {
      /** 添加页面 */
      add(data?: Page, signal?: AbortSignal): Promise<boolean> {
        return http({
          url: host + "/1/cms/page/add",
          method: "post",
          headers: { "Content-Type": "application/json" },
          data,
          signal,
        }).then((res) => res.data.data);
      },
      /** 批量发布 */
      batchPublish(
        params: {
          /** id */
          id: string,
        },
        data?: ObjectIdArray,
        signal?: AbortSignal
      ): Promise<boolean> {
        return http({
          url: host + "/1/cms/page/batch_publish",
          method: "post",
          headers: { "Content-Type": "application/json" },
          params,
          data,
          signal,
        }).then((res) => res.data.data);
      },
      /** 清楚页面缓存-重新加载页面 */
      clearCache(data?: ObjectId, signal?: AbortSignal): Promise<boolean> {
        return http({
          url: host + "/1/cms/page/clear_cache",
          method: "post",
          headers: { "Content-Type": "application/json" },
          data,
          signal,
        }).then((res) => res.data.data);
      },
      /** 逻辑删除 */
      delete(data?: ObjectId, signal?: AbortSignal): Promise<boolean> {
        return http({
          url: host + "/1/cms/page/delete",
          method: "post",
          headers: { "Content-Type": "application/json" },
          data,
          signal,
        }).then((res) => res.data.data);
      },
      /** 回退 */
      fallback(
        params: {
          /** 页面id */
          id: string,
          /** 发布id */
          publish_id: string,
        },
        signal?: AbortSignal
      ): Promise<boolean> {
        return http({
          url: host + "/1/cms/page/fallback",
          method: "post",
          headers: { "Content-Type": "application/json" },
          params,
          signal,
        }).then((res) => res.data.data);
      },
      /** 获取页面 by id */
      get(
        params: {
          /** id */
          id: string,
        },
        signal?: AbortSignal
      ): Promise<Page> {
        return http({
          url: host + "/1/cms/page/get",
          method: "get",
          headers: { "Content-Type": "application/json" },
          params,
          signal,
        }).then((res) => res.data.data);
      },
      /** 下线 */
      offline(data?: ObjectStatus, signal?: AbortSignal): Promise<boolean> {
        return http({
          url: host + "/1/cms/page/offline",
          method: "post",
          headers: { "Content-Type": "application/json" },
          data,
          signal,
        }).then((res) => res.data.data);
      },
      /** 上线 */
      online(data?: ObjectStatus, signal?: AbortSignal): Promise<boolean> {
        return http({
          url: host + "/1/cms/page/online",
          method: "post",
          headers: { "Content-Type": "application/json" },
          data,
          signal,
        }).then((res) => res.data.data);
      },
      /** page option */
      option(signal?: AbortSignal): Promise<PageOptionDTO[]> {
        return http({
          url: host + "/1/cms/page/option",
          method: "get",
          headers: { "Content-Type": "application/json" },
          signal,
        }).then((res) => res.data.data);
      },
      /** 分页查询 */
      pageList(
        params: {
          /** 查询条件 */
          query?: string,
          /** 页码 */
          page_no: number,
          /** 数量 */
          page_size: number,
        },
        signal?: AbortSignal
      ): Promise<PageList<PageInfoDTO>> {
        return http({
          url: host + "/1/cms/page/page_list",
          method: "get",
          headers: { "Content-Type": "application/json" },
          params,
          signal,
        }).then((res) => res.data.data);
      },
      /** 页面预览 */
      preview(
        params: {
          /** id */
          id: string,
        },
        signal?: AbortSignal
      ): Promise<string> {
        return http({
          url: host + "/1/cms/page/preview",
          method: "post",
          headers: { "Content-Type": "application/json" },
          params,
          signal,
        }).then((res) => res.data.data);
      },
      /** 发布 */
      publish(
        params: {
          /** id */
          id: string,
        },
        signal?: AbortSignal
      ): Promise<boolean> {
        return http({
          url: host + "/1/cms/page/publish",
          method: "post",
          headers: { "Content-Type": "application/json" },
          params,
          signal,
        }).then((res) => res.data.data);
      },
      /** 已发布页面信息 */
      publishList(
        params: {
          /** sn_id */
          sn_id: string,
          /** 页码 */
          page_no?: number,
          /** 数量 */
          page_size?: number,
        },
        signal?: AbortSignal
      ): Promise<PageList<PublishPage>> {
        return http({
          url: host + "/1/cms/page/publish_list",
          method: "get",
          headers: { "Content-Type": "application/json" },
          params,
          signal,
        }).then((res) => res.data.data);
      },
      /** 获取页面 */
      qget(
        params: {
          /** 查询条件 */
          query?: string,
        },
        signal?: AbortSignal
      ): Promise<Page> {
        return http({
          url: host + "/1/cms/page/qget",
          method: "get",
          headers: { "Content-Type": "application/json" },
          params,
          signal,
        }).then((res) => res.data.data);
      },
      /** 更新模块 */
      update(data?: Page, signal?: AbortSignal): Promise<boolean> {
        return http({
          url: host + "/1/cms/page/update",
          method: "post",
          headers: { "Content-Type": "application/json" },
          data,
          signal,
        }).then((res) => res.data.data);
      },
    },
    websiteConfig: {
      /** 获取网站配置信息 */
      get(
        params: {
          /** sn_id */
          sn_id: string,
        },
        signal?: AbortSignal
      ): Promise<WebsiteConfig> {
        return http({
          url: host + "/1/cms/website_config/get",
          method: "get",
          headers: { "Content-Type": "application/json" },
          params,
          signal,
        }).then((res) => res.data.data);
      },
      /** 更新网站配置 */
      save(data?: WebsiteConfig, signal?: AbortSignal): Promise<boolean> {
        return http({
          url: host + "/1/cms/website_config/save",
          method: "post",
          headers: { "Content-Type": "application/json" },
          data,
          signal,
        }).then((res) => res.data.data);
      },
    },
  },
  ms: {
    category: {
      /** 分类新增 */
      add(data?: Category, signal?: AbortSignal): Promise<string> {
        return http({
          url: host + "/1/ms/category/add",
          method: "post",
          headers: { "Content-Type": "application/json" },
          data,
          signal,
        }).then((res) => res.data.data);
      },
      /** 清理缓存 */
      clearCache(signal?: AbortSignal): Promise<boolean> {
        return http({
          url: host + "/1/ms/category/clear_cache",
          method: "get",
          headers: { "Content-Type": "application/json" },
          signal,
        }).then((res) => res.data.data);
      },
      /** 分类删除 */
      delete(
        params: {
          /** id */
          id: string,
        },
        signal?: AbortSignal
      ): Promise<boolean> {
        return http({
          url: host + "/1/ms/category/delete",
          method: "get",
          headers: { "Content-Type": "application/json" },
          params,
          signal,
        }).then((res) => res.data.data);
      },
      /** 分类及子分类获取 */
      get(
        params: {
          /** id */
          id?: string,
          /** 0 未审核 1 已审核 2 已发布 -1 全部 */
          status?: number,
          /** 0 当前级， 1 子一级，... -1 全部 */
          level?: number,
          /** code */
          code?: string,
        },
        signal?: AbortSignal
      ): Promise<Category> {
        return http({
          url: host + "/1/ms/category/get",
          method: "get",
          headers: { "Content-Type": "application/json" },
          params,
          signal,
        }).then((res) => res.data.data);
      },
      /** 分类及子分类获取 */
      getOption(
        params: {
          /** 0 当前级， 1 子一级，... -1 全部 */
          level?: number,
          /** code */
          code?: string,
          /** 1:value为id 2：value为code */
          type?: number,
        },
        signal?: AbortSignal
      ): Promise<OptionModel> {
        return http({
          url: host + "/1/ms/category/get_option",
          method: "get",
          headers: { "Content-Type": "application/json" },
          params,
          signal,
        }).then((res) => res.data.data);
      },
      /** 分类状态一键更新接口 */
      oneclickStatus(
        params: {
          /** id */
          id: string,
          /** 0,1,2,3 */
          status: number,
        },
        signal?: AbortSignal
      ): Promise<boolean> {
        return http({
          url: host + "/1/ms/category/oneclick_status",
          method: "get",
          headers: { "Content-Type": "application/json" },
          params,
          signal,
        }).then((res) => res.data.data);
      },
      /** 部分排序，若top_id和bottom_id都存在，则表示bottom_id和top_id之间的排序;否则表示上移下移（b_id为空，top_id不为空表示上移，反之下移） */
      sort(
        params: {
          /** 移动后上面文档id（或上移） */
          top_id?: string,
          /** 移动后下面文档id（或下移） */
          bottom_id?: string,
          /** 若是不在同一分类中移动，该字段表示要移动到的目标分类下,该id必须与top或者bottom中的一个id相同 */
          target_id?: string,
        },
        signal?: AbortSignal
      ): Promise<boolean> {
        return http({
          url: host + "/1/ms/category/sort",
          method: "get",
          headers: { "Content-Type": "application/json" },
          params,
          signal,
        }).then((res) => res.data.data);
      },
      /** 分类修改 */
      update(data?: Category, signal?: AbortSignal): Promise<boolean> {
        return http({
          url: host + "/1/ms/category/update",
          method: "post",
          headers: { "Content-Type": "application/json" },
          data,
          signal,
        }).then((res) => res.data.data);
      },
      /** 分类状态更新接口 */
      updateStatus(
        params: {
          /** 0,1,2,3 */
          status: number,
        },
        data?: string[],
        signal?: AbortSignal
      ): Promise<boolean> {
        return http({
          url: host + "/1/ms/category/update_status",
          method: "post",
          headers: { "Content-Type": "application/json" },
          params,
          data,
          signal,
        }).then((res) => res.data.data);
      },
    },
    design: {
      modelMeta: {
        /** 清理缓存 */
        clearCache(signal?: AbortSignal): Promise<boolean> {
          return http({
            url: host + "/1/ms/design/model_meta/clear_cache",
            method: "get",
            headers: { "Content-Type": "application/json" },
            signal,
          }).then((res) => res.data.data);
        },
        /** 删除 */
        delete(
          params: {
            /** id */
            id: string,
          },
          signal?: AbortSignal
        ): Promise<boolean> {
          return http({
            url: host + "/1/ms/design/model_meta/delete",
            method: "post",
            headers: { "Content-Type": "application/json" },
            params,
            signal,
          }).then((res) => res.data.data);
        },
        /** 根据主键进行查询 */
        get(
          params: {
            /** name */
            name?: string,
            /** id */
            id?: string,
          },
          signal?: AbortSignal
        ): Promise<ModelMetaPO> {
          return http({
            url: host + "/1/ms/design/model_meta/get",
            method: "get",
            headers: { "Content-Type": "application/json" },
            params,
            signal,
          }).then((res) => res.data.data);
        },
        /** 列表分页查询 */
        list(
          params: {
            /** 查询条件 */
            query?: string,
            /** 页码 */
            page_no: number,
            /** 数量 */
            page_size: number,
          },
          signal?: AbortSignal
        ): Promise<PageList<ModelMetaSimplePO>> {
          return http({
            url: host + "/1/ms/design/model_meta/list",
            method: "get",
            headers: { "Content-Type": "application/json" },
            params,
            signal,
          }).then((res) => res.data.data);
        },
        /** 保存 */
        save(
          params: {
            /** id */
            id?: string,
          },
          data?: ModelMeta,
          signal?: AbortSignal
        ): Promise<string> {
          return http({
            url: host + "/1/ms/design/model_meta/save",
            method: "post",
            headers: { "Content-Type": "application/json" },
            params,
            data,
            signal,
          }).then((res) => res.data.data);
        },
        ui: {
          /** 根据主键进行查询 */
          get(
            params: {
              /** id */
              id: string,
            },
            signal?: AbortSignal
          ): Promise<ModelConfig> {
            return http({
              url: host + "/1/ms/design/model_meta/ui/get",
              method: "get",
              headers: { "Content-Type": "application/json" },
              params,
              signal,
            }).then((res) => res.data.data);
          },
          /** 保存 */
          save(data?: ModelConfig, signal?: AbortSignal): Promise<boolean> {
            return http({
              url: host + "/1/ms/design/model_meta/ui/save",
              method: "post",
              headers: { "Content-Type": "application/json" },
              data,
              signal,
            }).then((res) => res.data.data);
          },
        },
        /** 更新状态 */
        updateStatus(
          params: {
            /** id */
            id: string,
            /** status */
            status: string,
          },
          signal?: AbortSignal
        ): Promise<boolean> {
          return http({
            url: host + "/1/ms/design/model_meta/update_status",
            method: "post",
            headers: { "Content-Type": "application/json" },
            params,
            signal,
          }).then((res) => res.data.data);
        },
      },
      screen: {
        /** 添加 */
        add(data?: ScreenConfig, signal?: AbortSignal): Promise<boolean> {
          return http({
            url: host + "/1/ms/design/screen/add",
            method: "post",
            headers: { "Content-Type": "application/json" },
            data,
            signal,
          }).then((res) => res.data.data);
        },
        /** 删除 */
        delete(data?: ObjectId, signal?: AbortSignal): Promise<boolean> {
          return http({
            url: host + "/1/ms/design/screen/delete",
            method: "post",
            headers: { "Content-Type": "application/json" },
            data,
            signal,
          }).then((res) => res.data.data);
        },
        /** 详细查询 */
        get(
          params: {
            /** ID */
            id?: string,
            /** 标识 */
            alias?: string,
          },
          signal?: AbortSignal
        ): Promise<ScreenConfig> {
          return http({
            url: host + "/1/ms/design/screen/get",
            method: "get",
            headers: { "Content-Type": "application/json" },
            params,
            signal,
          }).then((res) => res.data.data);
        },
        /** 列表分页查询 */
        list(
          params: {
            /** 页码 */
            page_no: number,
            /** 数量 */
            page_size: number,
          },
          signal?: AbortSignal
        ): Promise<PageList<ScreenConfig>> {
          return http({
            url: host + "/1/ms/design/screen/list",
            method: "get",
            headers: { "Content-Type": "application/json" },
            params,
            signal,
          }).then((res) => res.data.data);
        },
        /** 更新 */
        update(data?: ScreenConfig, signal?: AbortSignal): Promise<boolean> {
          return http({
            url: host + "/1/ms/design/screen/update",
            method: "post",
            headers: { "Content-Type": "application/json" },
            data,
            signal,
          }).then((res) => res.data.data);
        },
      },
    },
    dictionary: {
      /** 清理缓存 */
      clearCache(signal?: AbortSignal): Promise<boolean> {
        return http({
          url: host + "/1/ms/dictionary/clear_cache",
          method: "get",
          headers: { "Content-Type": "application/json" },
          signal,
        }).then((res) => res.data.data);
      },
      /** 字典创建接口 */
      create(data?: Dictionary, signal?: AbortSignal): Promise<string> {
        return http({
          url: host + "/1/ms/dictionary/create",
          method: "post",
          headers: { "Content-Type": "application/json" },
          data,
          signal,
        }).then((res) => res.data.data);
      },
      /** 字典删除接口 */
      delete(data?: string[], signal?: AbortSignal): Promise<boolean> {
        return http({
          url: host + "/1/ms/dictionary/delete",
          method: "post",
          headers: { "Content-Type": "application/json" },
          data,
          signal,
        }).then((res) => res.data.data);
      },
      /** 查询字典信息接口(两个参数任选其一) */
      get(
        params: {
          /** 字典编码 */
          code?: string,
          /** 字典id */
          id?: string,
          /** 状态 */
          status?: number,
        },
        signal?: AbortSignal
      ): Promise<Dictionary> {
        return http({
          url: host + "/1/ms/dictionary/get",
          method: "get",
          headers: { "Content-Type": "application/json" },
          params,
          signal,
        }).then((res) => res.data.data);
      },
      /** 查询字典项名称 */
      getItemName(
        params: {
          /** 字典编码 */
          code?: string,
          /** 字典项值 */
          item_value?: string,
        },
        signal?: AbortSignal
      ): Promise<string> {
        return http({
          url: host + "/1/ms/dictionary/get_item_name",
          method: "get",
          headers: { "Content-Type": "application/json" },
          params,
          signal,
        }).then((res) => res.data.data);
      },
      /** 字典option接口 */
      getOption(
        params: {
          /** 字典编码 */
          code: string,
        },
        signal?: AbortSignal
      ): Promise<OptionModel[]> {
        return http({
          url: host + "/1/ms/dictionary/get_option",
          method: "get",
          headers: { "Content-Type": "application/json" },
          params,
          signal,
        }).then((res) => res.data.data);
      },
      /** 查询字典（组合）详细信息接口 */
      groupGet(
        params: {
          /** 字典编码 */
          code?: string,
          /** 字典项状态 */
          item_status?: number,
        },
        signal?: AbortSignal
      ): Promise<Dictionary> {
        return http({
          url: host + "/1/ms/dictionary/group_get",
          method: "get",
          headers: { "Content-Type": "application/json" },
          params,
          signal,
        }).then((res) => res.data.data);
      },
      /** 查询字典（组合）列表接口 */
      groupList(
        params: {
          /** 字典名称 */
          name?: string,
          /** 字典编码 */
          code?: string,
          /** 字典状态 */
          dic_status?: number,
          /** 字典项状态 */
          item_status?: number,
          /** 页码 */
          page_no?: number,
          /** 页面容量 */
          page_size?: number,
        },
        signal?: AbortSignal
      ): Promise<PageList<Dictionary>> {
        return http({
          url: host + "/1/ms/dictionary/group_list",
          method: "get",
          headers: { "Content-Type": "application/json" },
          params,
          signal,
        }).then((res) => res.data.data);
      },
      /** 字典项创建接口 */
      itemCreate(data?: DictionaryItem, signal?: AbortSignal): Promise<string> {
        return http({
          url: host + "/1/ms/dictionary/item_create",
          method: "post",
          headers: { "Content-Type": "application/json" },
          data,
          signal,
        }).then((res) => res.data.data);
      },
      /** 字典项删除接口 */
      itemDelete(
        params: {
          /** 字典项id */
          id: string,
        },
        signal?: AbortSignal
      ): Promise<boolean> {
        return http({
          url: host + "/1/ms/dictionary/item_delete",
          method: "post",
          headers: { "Content-Type": "application/json" },
          params,
          signal,
        }).then((res) => res.data.data);
      },
      /** 查询字典项信息接口 */
      itemGet(
        params: {
          /** 字典项id */
          id: string,
        },
        signal?: AbortSignal
      ): Promise<DictionaryItem> {
        return http({
          url: host + "/1/ms/dictionary/item_get",
          method: "get",
          headers: { "Content-Type": "application/json" },
          params,
          signal,
        }).then((res) => res.data.data);
      },
      /** 查询字典项列表接口 */
      itemList(
        params: {
          /** 字典id */
          dic_id: string,
          /** 字典项名称 */
          name?: string,
          /** 字典项状态 */
          item_status?: number,
          /** 页码 */
          page_no?: number,
          /** 页面容量 */
          page_size?: number,
        },
        signal?: AbortSignal
      ): Promise<PageList<DictionaryItem>> {
        return http({
          url: host + "/1/ms/dictionary/item_list",
          method: "get",
          headers: { "Content-Type": "application/json" },
          params,
          signal,
        }).then((res) => res.data.data);
      },
      /** 字典项更新接口 */
      itemUpdate(
        data?: DictionaryItem,
        signal?: AbortSignal
      ): Promise<boolean> {
        return http({
          url: host + "/1/ms/dictionary/item_update",
          method: "post",
          headers: { "Content-Type": "application/json" },
          data,
          signal,
        }).then((res) => res.data.data);
      },
      /** 查询字典列表接口 */
      list(
        params: {
          /** 字典名称 */
          name?: string,
          /** 字典编码 */
          code?: string,
          /** 字典状态 */
          status?: number,
          /** 页码 */
          page_no?: number,
          /** 页面容量 */
          page_size?: number,
        },
        signal?: AbortSignal
      ): Promise<PageList<Dictionary>> {
        return http({
          url: host + "/1/ms/dictionary/list",
          method: "get",
          headers: { "Content-Type": "application/json" },
          params,
          signal,
        }).then((res) => res.data.data);
      },
      /** 字典更新接口 */
      update(data?: Dictionary, signal?: AbortSignal): Promise<boolean> {
        return http({
          url: host + "/1/ms/dictionary/update",
          method: "post",
          headers: { "Content-Type": "application/json" },
          data,
          signal,
        }).then((res) => res.data.data);
      },
    },
    pemAction: {
      /** 操作创建接口 */
      create(data?: Action, signal?: AbortSignal): Promise<string> {
        return http({
          url: host + "/1/ms/pem_action/create",
          method: "post",
          headers: { "Content-Type": "application/json" },
          data,
          signal,
        }).then((res) => res.data.data);
      },
      /** 操作批量删除接口 */
      delete(data?: string[], signal?: AbortSignal): Promise<boolean> {
        return http({
          url: host + "/1/ms/pem_action/delete",
          method: "post",
          headers: { "Content-Type": "application/json" },
          data,
          signal,
        }).then((res) => res.data.data);
      },
      /** 根据操作ID查询操作信息接口 */
      getById(
        params: {
          /** 资源id */
          id: string,
        },
        signal?: AbortSignal
      ): Promise<Action> {
        return http({
          url: host + "/1/ms/pem_action/get_by_id",
          method: "get",
          headers: { "Content-Type": "application/json" },
          params,
          signal,
        }).then((res) => res.data.data);
      },
      /** 查询操作列表接口 */
      list(
        params: {
          /** 页码 */
          page_no?: number,
          /** 页面容量 */
          page_size?: number,
        },
        signal?: AbortSignal
      ): Promise<PageList<Action>> {
        return http({
          url: host + "/1/ms/pem_action/list",
          method: "get",
          headers: { "Content-Type": "application/json" },
          params,
          signal,
        }).then((res) => res.data.data);
      },
      /** 操作更新接口 */
      update(data?: Action, signal?: AbortSignal): Promise<boolean> {
        return http({
          url: host + "/1/ms/pem_action/update",
          method: "post",
          headers: { "Content-Type": "application/json" },
          data,
          signal,
        }).then((res) => res.data.data);
      },
    },
    pemResource: {
      /** 资源创建接口 */
      create(data?: Resource, signal?: AbortSignal): Promise<string> {
        return http({
          url: host + "/1/ms/pem_resource/create",
          method: "post",
          headers: { "Content-Type": "application/json" },
          data,
          signal,
        }).then((res) => res.data.data);
      },
      /** 资源批量删除接口 */
      delete(data?: string[], signal?: AbortSignal): Promise<boolean> {
        return http({
          url: host + "/1/ms/pem_resource/delete",
          method: "post",
          headers: { "Content-Type": "application/json" },
          data,
          signal,
        }).then((res) => res.data.data);
      },
      /** 查询资源信息接口 */
      get(
        params: {
          /** 资源唯一标识 */
          identity: string,
          /** 分组名 */
          group?: string,
        },
        signal?: AbortSignal
      ): Promise<Resource> {
        return http({
          url: host + "/1/ms/pem_resource/get",
          method: "get",
          headers: { "Content-Type": "application/json" },
          params,
          signal,
        }).then((res) => res.data.data);
      },
      /** 根据资源ID查询资源信息接口 */
      getById(
        params: {
          /** 资源id */
          id: string,
        },
        signal?: AbortSignal
      ): Promise<Resource> {
        return http({
          url: host + "/1/ms/pem_resource/get_by_id",
          method: "get",
          headers: { "Content-Type": "application/json" },
          params,
          signal,
        }).then((res) => res.data.data);
      },
      /** 查询资源列表接口 */
      list(
        params: {
          /** 资源名称 */
          name?: string,
          /** 类型 */
          type?: number,
          /** 分组名 */
          group?: string,
          /** 页码 */
          page_no?: number,
          /** 页面容量 */
          page_size?: number,
        },
        signal?: AbortSignal
      ): Promise<PageList<Resource>> {
        return http({
          url: host + "/1/ms/pem_resource/list",
          method: "get",
          headers: { "Content-Type": "application/json" },
          params,
          signal,
        }).then((res) => res.data.data);
      },
      /** 资源更新接口 */
      update(data?: Resource, signal?: AbortSignal): Promise<boolean> {
        return http({
          url: host + "/1/ms/pem_resource/update",
          method: "post",
          headers: { "Content-Type": "application/json" },
          data,
          signal,
        }).then((res) => res.data.data);
      },
    },
    pemRole: {
      /** 角色创建接口 */
      create(data?: Role, signal?: AbortSignal): Promise<string> {
        return http({
          url: host + "/1/ms/pem_role/create",
          method: "post",
          headers: { "Content-Type": "application/json" },
          data,
          signal,
        }).then((res) => res.data.data);
      },
      /** 角色批量删除接口 */
      delete(data?: string[], signal?: AbortSignal): Promise<boolean> {
        return http({
          url: host + "/1/ms/pem_role/delete",
          method: "post",
          headers: { "Content-Type": "application/json" },
          data,
          signal,
        }).then((res) => res.data.data);
      },
      /** 根据角色别名查询角色信息接口 */
      getByAlias(
        params: {
          /** 角色别名 */
          alias: string,
        },
        signal?: AbortSignal
      ): Promise<Role> {
        return http({
          url: host + "/1/ms/pem_role/get_by_alias",
          method: "get",
          headers: { "Content-Type": "application/json" },
          params,
          signal,
        }).then((res) => res.data.data);
      },
      /** 根据角色ID查询角色信息接口 */
      getById(
        params: {
          /** 角色id */
          id: string,
        },
        signal?: AbortSignal
      ): Promise<Role> {
        return http({
          url: host + "/1/ms/pem_role/get_by_id",
          method: "get",
          headers: { "Content-Type": "application/json" },
          params,
          signal,
        }).then((res) => res.data.data);
      },
      /** 查询角色列表接口 */
      list(
        params: {
          /** 角色名称 */
          name?: string,
          /** 角色类型 */
          role_type?: number,
          /** 页码 */
          page_no?: number,
          /** 页面容量 */
          page_size?: number,
        },
        signal?: AbortSignal
      ): Promise<PageList<Role>> {
        return http({
          url: host + "/1/ms/pem_role/list",
          method: "get",
          headers: { "Content-Type": "application/json" },
          params,
          signal,
        }).then((res) => res.data.data);
      },
      /** 角色更新接口 */
      update(data?: Role, signal?: AbortSignal): Promise<boolean> {
        return http({
          url: host + "/1/ms/pem_role/update",
          method: "post",
          headers: { "Content-Type": "application/json" },
          data,
          signal,
        }).then((res) => res.data.data);
      },
    },
    pemRoleResource: {
      /** 修改角色权限关系 */
      batchUpdate(
        data?: RoleAuthorityUpdateDTO,
        signal?: AbortSignal
      ): Promise<boolean> {
        return http({
          url: host + "/1/ms/pem_role_resource/batch_update",
          method: "post",
          headers: { "Content-Type": "application/json" },
          data,
          signal,
        }).then((res) => res.data.data);
      },
      /** 角色权限创建接口 */
      create(data?: RoleAuthority, signal?: AbortSignal): Promise<string> {
        return http({
          url: host + "/1/ms/pem_role_resource/create",
          method: "post",
          headers: { "Content-Type": "application/json" },
          data,
          signal,
        }).then((res) => res.data.data);
      },
      /** 角色权限删除接口 */
      delete(data?: RoleAuthority, signal?: AbortSignal): Promise<boolean> {
        return http({
          url: host + "/1/ms/pem_role_resource/delete",
          method: "post",
          headers: { "Content-Type": "application/json" },
          data,
          signal,
        }).then((res) => res.data.data);
      },
      /** 向角色授权资源的筛选列表 */
      filterList(
        params: {
          /** 角色id */
          role_id: string,
        },
        signal?: AbortSignal
      ): Promise<RoleAuthShowDTO> {
        return http({
          url: host + "/1/ms/pem_role_resource/filter_list",
          method: "get",
          headers: { "Content-Type": "application/json" },
          params,
          signal,
        }).then((res) => res.data.data);
      },
      /** 查询角色权限列表接口 */
      list(
        params: {
          /** 角色id */
          role_id?: string,
          /** 操作id */
          action_id?: string,
          /** 资源id */
          resource_id?: string,
          /** 页码(-1 查所有) */
          page_no?: number,
          /** 页面容量 */
          page_size?: number,
        },
        signal?: AbortSignal
      ): Promise<PageList<RoleAuthority>> {
        return http({
          url: host + "/1/ms/pem_role_resource/list",
          method: "get",
          headers: { "Content-Type": "application/json" },
          params,
          signal,
        }).then((res) => res.data.data);
      },
      /** 分页查询角色权限关系 */
      specificList(
        params: {
          /** 角色id */
          role_id: string,
          /** 资源名称 */
          name?: string,
          /** 操作id */
          action_id?: string,
          /** 类型 */
          type?: number,
          /** 分组名 */
          group?: string,
          /** 页码 */
          page_no?: number,
          /** 页面容量 */
          page_size?: number,
        },
        signal?: AbortSignal
      ): Promise<PageList<RoleAuthorityListDTO>> {
        return http({
          url: host + "/1/ms/pem_role_resource/specific_list",
          method: "get",
          headers: { "Content-Type": "application/json" },
          params,
          signal,
        }).then((res) => res.data.data);
      },
    },
    pemUser: {
      /** 修改授权对象的权限 */
      batchUpdate(
        data?: SubjectAuthorityDTO,
        signal?: AbortSignal
      ): Promise<boolean> {
        return http({
          url: host + "/1/ms/pem_user/batch_update",
          method: "post",
          headers: { "Content-Type": "application/json" },
          data,
          signal,
        }).then((res) => res.data.data);
      },
      /** 操作者权限创建接口 */
      create(data?: SubjectAuthority, signal?: AbortSignal): Promise<string> {
        return http({
          url: host + "/1/ms/pem_user/create",
          method: "post",
          headers: { "Content-Type": "application/json" },
          data,
          signal,
        }).then((res) => res.data.data);
      },
      /** 不传递 project_id，获取系统权限，传递 project_id 获取项目中权限 */
      currentPemList(
        params: {
          /** 项目id */
          project_id?: string,
        },
        signal?: AbortSignal
      ): Promise<UserAuthDTO> {
        return http({
          url: host + "/1/ms/pem_user/current_pem_list",
          method: "get",
          headers: { "Content-Type": "application/json" },
          params,
          signal,
        }).then((res) => res.data.data);
      },
      /** 不传递 project_id，获取系统权限，传递 project_id 获取项目中权限 */
      currentUserAuth(
        params: {
          /** 项目id */
          project_id?: string,
          /** 资源类型 */
          type?: number,
        },
        signal?: AbortSignal
      ): Promise<CurrentUserAuth> {
        return http({
          url: host + "/1/ms/pem_user/current_user_auth",
          method: "get",
          headers: { "Content-Type": "application/json" },
          params,
          signal,
        }).then((res) => res.data.data);
      },
      /** 操作者权限删除接口 */
      delete(data?: SubjectAuthority, signal?: AbortSignal): Promise<boolean> {
        return http({
          url: host + "/1/ms/pem_user/delete",
          method: "post",
          headers: { "Content-Type": "application/json" },
          data,
          signal,
        }).then((res) => res.data.data);
      },
      /** 查询授权对象是否有某个资源的权限 */
      hasByAppid(
        params: {
          /** 对象id */
          subject_id: string,
          /** 资源别名 */
          identity: string,
          /** 组织id */
          org_id?: string,
          /** 操作别名 */
          alias: string,
          /** 分组 */
          group?: string,
          /** 操作id */
          action_id?: string,
        },
        signal?: AbortSignal
      ): Promise<boolean> {
        return http({
          url: host + "/1/ms/pem_user/has_by_appid",
          method: "get",
          headers: { "Content-Type": "application/json" },
          params,
          signal,
        }).then((res) => res.data.data);
      },
      /** 查询授权对象是否有某个资源的权限 */
      hasByResourceid(
        params: {
          /** 资源id */
          resource_id: string,
          /** 对象id */
          subject_id: string,
          /** 操作id */
          action_id?: string,
          /** 组织id */
          org_id?: string,
          /** 操作别名 */
          alias: string,
        },
        signal?: AbortSignal
      ): Promise<boolean> {
        return http({
          url: host + "/1/ms/pem_user/has_by_resourceid",
          method: "get",
          headers: { "Content-Type": "application/json" },
          params,
          signal,
        }).then((res) => res.data.data);
      },
      /** 查询操作者权限关系（查询拥有某权限的操作者 || 查询操作者的权限） */
      list(
        params: {
          /** 资源id */
          resource_id?: string,
          /** 对象id */
          subject_id?: string,
          /** 操作id */
          action_id?: string,
          /** 操作id */
          org_id?: string,
          /** 页码 */
          page_no?: number,
          /** 页面容量 */
          page_size?: number,
        },
        signal?: AbortSignal
      ): Promise<PageList<SubjectAuthority>> {
        return http({
          url: host + "/1/ms/pem_user/list",
          method: "get",
          headers: { "Content-Type": "application/json" },
          params,
          signal,
        }).then((res) => res.data.data);
      },
      /** 分页查询授权对象的权限(详细信息) */
      specificList(
        params: {
          /** 操作id */
          action_id?: string,
          /** 对象id */
          subject_id: string,
          /** 资源名称 */
          resource_name?: string,
          /** 组织id */
          org_id?: string,
          /** 资源类型 */
          type?: number,
          /** 分组名 */
          group?: string,
          /** 页码 */
          page_no?: number,
          /** 页面容量 */
          page_size?: number,
        },
        signal?: AbortSignal
      ): Promise<PageList<SubjectAuthrityListDTO>> {
        return http({
          url: host + "/1/ms/pem_user/specific_list",
          method: "get",
          headers: { "Content-Type": "application/json" },
          params,
          signal,
        }).then((res) => res.data.data);
      },
    },
    pemUserRole: {
      /** 操作者角色创建接口 */
      create(data?: SubjectRole, signal?: AbortSignal): Promise<string> {
        return http({
          url: host + "/1/ms/pem_user_role/create",
          method: "post",
          headers: { "Content-Type": "application/json" },
          data,
          signal,
        }).then((res) => res.data.data);
      },
      /** 操作者角色删除接口 */
      delete(data?: SubjectRole, signal?: AbortSignal): Promise<boolean> {
        return http({
          url: host + "/1/ms/pem_user_role/delete",
          method: "post",
          headers: { "Content-Type": "application/json" },
          data,
          signal,
        }).then((res) => res.data.data);
      },
      /** 操作者角色删除接口 参数根据需求任选其一或同时传 */
      deleteBySubject(
        params: {
          /** 对象id */
          subject_id?: string,
          /** 组织id */
          org_id?: string,
        },
        signal?: AbortSignal
      ): Promise<boolean> {
        return http({
          url: host + "/1/ms/pem_user_role/delete_by_subject",
          method: "post",
          headers: { "Content-Type": "application/json" },
          params,
          signal,
        }).then((res) => res.data.data);
      },
      /** 查询授权对象是否有某个角色 */
      hasByAppid(
        params: {
          /** 角色别名 */
          alias: string,
          /** 组织id */
          org_id?: string,
          /** 对象id */
          subject_id?: string,
        },
        signal?: AbortSignal
      ): Promise<boolean> {
        return http({
          url: host + "/1/ms/pem_user_role/has_by_appid",
          method: "get",
          headers: { "Content-Type": "application/json" },
          params,
          signal,
        }).then((res) => res.data.data);
      },
      /** 查询授权对象是否有某个角色 */
      hasByRoleid(
        params: {
          /** 角色id */
          role_id: string,
          /** 组织id */
          org_id?: string,
          /** 对象id */
          subject_id?: string,
        },
        signal?: AbortSignal
      ): Promise<boolean> {
        return http({
          url: host + "/1/ms/pem_user_role/has_by_roleid",
          method: "get",
          headers: { "Content-Type": "application/json" },
          params,
          signal,
        }).then((res) => res.data.data);
      },
      /** 查询操作者角色接口 | 查询某个角色下有哪些授权对象 */
      list(
        params: {
          /** 角色id */
          role_id?: string,
          /** 组织id */
          org_id?: string,
          /** 对象id */
          subject_id?: string,
        },
        signal?: AbortSignal
      ): Promise<SubjectRole[]> {
        return http({
          url: host + "/1/ms/pem_user_role/list",
          method: "get",
          headers: { "Content-Type": "application/json" },
          params,
          signal,
        }).then((res) => res.data.data);
      },
      /** 查询授权对象的角色 */
      roleList(
        params: {
          /** 组织id */
          org_id?: string,
          /** 对象id */
          subject_id: string,
          /** 角色名称 */
          name?: string,
          /** 页码 */
          page_no?: number,
          /** 页面容量 */
          page_size?: number,
        },
        signal?: AbortSignal
      ): Promise<PageList<Role>> {
        return http({
          url: host + "/1/ms/pem_user_role/role_list",
          method: "get",
          headers: { "Content-Type": "application/json" },
          params,
          signal,
        }).then((res) => res.data.data);
      },
      /** 修改某个角色下的授权对象 */
      updateRoleSubject(
        data?: RoleSubjectUpdateDTO,
        signal?: AbortSignal
      ): Promise<boolean> {
        return http({
          url: host + "/1/ms/pem_user_role/update_role_subject",
          method: "post",
          headers: { "Content-Type": "application/json" },
          data,
          signal,
        }).then((res) => res.data.data);
      },
      /** 修改某个授权对象的角色 */
      updateSubjectRole(
        data?: SubjectRoleDTO,
        signal?: AbortSignal
      ): Promise<boolean> {
        return http({
          url: host + "/1/ms/pem_user_role/update_subject_role",
          method: "post",
          headers: { "Content-Type": "application/json" },
          data,
          signal,
        }).then((res) => res.data.data);
      },
    },
    preview: {
      /** html文件预览 */
      htmlPreview(
        params: {
          /** content */
          content: string,
        },
        signal?: AbortSignal
      ): Promise<boolean> {
        return http({
          url: host + "/1/ms/preview/html_preview",
          method: "post",
          headers: { "Content-Type": "application/json" },
          params,
          signal,
        }).then((res) => res.data.data);
      },
      /** 本地资源文件预览 */
      localPreview(
        params: {
          /** path */
          path: string,
        },
        signal?: AbortSignal
      ): Promise<boolean> {
        return http({
          url: host + "/1/ms/preview/local_preview",
          method: "post",
          headers: { "Content-Type": "application/json" },
          params,
          signal,
        }).then((res) => res.data.data);
      },
      /** multipart文件预览 */
      multipartPreview(
        data?: FormData,
        signal?: AbortSignal
      ): Promise<boolean> {
        return http({
          url: host + "/1/ms/preview/multipart_preview",
          method: "post",
          headers: { "Content-Type": "multipart/form-data" },
          data,
          signal,
        }).then((res) => res.data.data);
      },
      /** 网络资源文件预览 */
      networkPreview(data?: ObjectId, signal?: AbortSignal): Promise<boolean> {
        return http({
          url: host + "/1/ms/preview/network_preview",
          method: "post",
          headers: { "Content-Type": "application/json" },
          data,
          signal,
        }).then((res) => res.data.data);
      },
    },
    quartz: {
      /** 添加定时任务 */
      add(data?: QuartzJob, signal?: AbortSignal): Promise<boolean> {
        return http({
          url: host + "/1/ms/quartz/add",
          method: "post",
          headers: { "Content-Type": "application/json" },
          data,
          signal,
        }).then((res) => res.data.data);
      },
      /** 删除 */
      delete(data?: ObjectId, signal?: AbortSignal): Promise<boolean> {
        return http({
          url: host + "/1/ms/quartz/delete",
          method: "post",
          headers: { "Content-Type": "application/json" },
          data,
          signal,
        }).then((res) => res.data.data);
      },
      /** 批量删除 */
      deleteBatch(
        data?: ObjectIdArray,
        signal?: AbortSignal
      ): Promise<boolean> {
        return http({
          url: host + "/1/ms/quartz/delete_batch",
          method: "post",
          headers: { "Content-Type": "application/json" },
          data,
          signal,
        }).then((res) => res.data.data);
      },
      /** 立即执行 */
      execute(data?: ObjectId, signal?: AbortSignal): Promise<boolean> {
        return http({
          url: host + "/1/ms/quartz/execute",
          method: "post",
          headers: { "Content-Type": "application/json" },
          data,
          signal,
        }).then((res) => res.data.data);
      },
      /** 通过id查询 */
      get(data?: ObjectId, signal?: AbortSignal): Promise<QuartzJob> {
        return http({
          url: host + "/1/ms/quartz/get",
          method: "get",
          headers: { "Content-Type": "application/json" },
          data,
          signal,
        }).then((res) => res.data.data);
      },
      /** 列表分页查询 */
      list(
        params: {
          /** 查询条件 */
          query?: string,
          /** 页码 */
          page_no: number,
          /** 数量 */
          page_size: number,
        },
        signal?: AbortSignal
      ): Promise<PageList<QuartzJob>> {
        return http({
          url: host + "/1/ms/quartz/list",
          method: "get",
          headers: { "Content-Type": "application/json" },
          params,
          signal,
        }).then((res) => res.data.data);
      },
      /** 停止定时任务 */
      pause(data?: ObjectId, signal?: AbortSignal): Promise<boolean> {
        return http({
          url: host + "/1/ms/quartz/pause",
          method: "post",
          headers: { "Content-Type": "application/json" },
          data,
          signal,
        }).then((res) => res.data.data);
      },
      /** 启动定时任务 */
      resume(data?: ObjectId, signal?: AbortSignal): Promise<boolean> {
        return http({
          url: host + "/1/ms/quartz/resume",
          method: "post",
          headers: { "Content-Type": "application/json" },
          data,
          signal,
        }).then((res) => res.data.data);
      },
      /** 更新定时任务 */
      update(data?: QuartzJob, signal?: AbortSignal): Promise<boolean> {
        return http({
          url: host + "/1/ms/quartz/update",
          method: "post",
          headers: { "Content-Type": "application/json" },
          data,
          signal,
        }).then((res) => res.data.data);
      },
    },
    upload: {
      file: {
        /** 添加文件 */
        add(data?: SysFile, signal?: AbortSignal): Promise<boolean> {
          return http({
            url: host + "/1/ms/upload/file/add",
            method: "post",
            headers: { "Content-Type": "application/json" },
            data,
            signal,
          }).then((res) => res.data.data);
        },
        /** 删除文件 */
        delete(data?: ObjectId, signal?: AbortSignal): Promise<boolean> {
          return http({
            url: host + "/1/ms/upload/file/delete",
            method: "post",
            headers: { "Content-Type": "application/json" },
            data,
            signal,
          }).then((res) => res.data.data);
        },
        /** 文件列表 */
        list(signal?: AbortSignal): Promise<PageList<SysFile>> {
          return http({
            url: host + "/1/ms/upload/file/list",
            method: "get",
            headers: { "Content-Type": "application/json" },
            signal,
          }).then((res) => res.data.data);
        },
      },
    },
    user: {
      /** 添加用户 */
      add(data?: User, signal?: AbortSignal): Promise<User> {
        return http({
          url: host + "/1/ms/user/add",
          method: "post",
          headers: { "Content-Type": "application/json" },
          data,
          signal,
        }).then((res) => res.data.data);
      },
      /** 根据UC用户id，或者UC用户手机号添加用户 */
      addByUc(
        params: {
          /** 用户id */
          user_id?: string,
          /** 手机号 */
          mobile?: string,
        },
        signal?: AbortSignal
      ): Promise<boolean> {
        return http({
          url: host + "/1/ms/user/add_by_uc",
          method: "get",
          headers: { "Content-Type": "application/json" },
          params,
          signal,
        }).then((res) => res.data.data);
      },
      /** 查询所有用户列表 */
      allList(
        params: {
          /** 用户账号 */
          account?: string,
          /** 用户名称 */
          full_name?: string,
        },
        signal?: AbortSignal
      ): Promise<User[]> {
        return http({
          url: host + "/1/ms/user/all_list",
          method: "get",
          headers: { "Content-Type": "application/json" },
          params,
          signal,
        }).then((res) => res.data.data);
      },
      /** 删除用户 */
      delete(data?: string[], signal?: AbortSignal): Promise<boolean> {
        return http({
          url: host + "/1/ms/user/delete",
          method: "post",
          headers: { "Content-Type": "application/json" },
          data,
          signal,
        }).then((res) => res.data.data);
      },
      /** 根据用户account查询用户信息接口 */
      getByAccount(
        params: {
          /** 用户account */
          account: string,
        },
        signal?: AbortSignal
      ): Promise<User> {
        return http({
          url: host + "/1/ms/user/get_by_account",
          method: "get",
          headers: { "Content-Type": "application/json" },
          params,
          signal,
        }).then((res) => res.data.data);
      },
      /** 根据用户ID查询用户信息接口 */
      getById(
        params: {
          /** 用户id */
          id: string,
        },
        signal?: AbortSignal
      ): Promise<User> {
        return http({
          url: host + "/1/ms/user/get_by_id",
          method: "get",
          headers: { "Content-Type": "application/json" },
          params,
          signal,
        }).then((res) => res.data.data);
      },
      /** 根据用户mobile查询用户信息接口 */
      getByMobile(
        params: {
          /** 用户mobile */
          mobile: string,
        },
        signal?: AbortSignal
      ): Promise<User> {
        return http({
          url: host + "/1/ms/user/get_by_mobile",
          method: "get",
          headers: { "Content-Type": "application/json" },
          params,
          signal,
        }).then((res) => res.data.data);
      },
      /** 根据UC用户id，或者UC用户手机号添加用户 */
      getUserinfoByUc(
        params: {
          /** 手机号,邮箱,账号,用户id */
          key: string,
        },
        signal?: AbortSignal
      ): Promise<User> {
        return http({
          url: host + "/1/ms/user/get_userinfo_by_uc",
          method: "get",
          headers: { "Content-Type": "application/json" },
          params,
          signal,
        }).then((res) => res.data.data);
      },
      /** 按分页查询用户列表 */
      pageList(
        params: {
          /** 用户账号 */
          account?: string,
          /** 用户名称 */
          full_name?: string,
          /** 手机号码 */
          mobile?: string,
          /** 页码 */
          page_no?: number,
          /** 页面容量 */
          page_size?: number,
        },
        signal?: AbortSignal
      ): Promise<PageList<User>> {
        return http({
          url: host + "/1/ms/user/page_list",
          method: "get",
          headers: { "Content-Type": "application/json" },
          params,
          signal,
        }).then((res) => res.data.data);
      },
      /** 本人-更新用户账号(需要传id和account字段) */
      selfUpdateAccount(data?: User, signal?: AbortSignal): Promise<boolean> {
        return http({
          url: host + "/1/ms/user/self_update_account",
          method: "post",
          headers: { "Content-Type": "application/json" },
          data,
          signal,
        }).then((res) => res.data.data);
      },
      /** 本人-更新用户名（需要传full_name字段） */
      selfUpdateFullname(data?: User, signal?: AbortSignal): Promise<boolean> {
        return http({
          url: host + "/1/ms/user/self_update_fullname",
          method: "post",
          headers: { "Content-Type": "application/json" },
          data,
          signal,
        }).then((res) => res.data.data);
      },
      /** 本人-更新用户手机号(需要传mobile字段) */
      selfUpdateMobile(data?: User, signal?: AbortSignal): Promise<boolean> {
        return http({
          url: host + "/1/ms/user/self_update_mobile",
          method: "post",
          headers: { "Content-Type": "application/json" },
          data,
          signal,
        }).then((res) => res.data.data);
      },
      /** 本人-更新用户登录密码（需传old_password和new_password字段） */
      selfUpdatePassword(data?: User, signal?: AbortSignal): Promise<boolean> {
        return http({
          url: host + "/1/ms/user/self_update_password",
          method: "post",
          headers: { "Content-Type": "application/json" },
          data,
          signal,
        }).then((res) => res.data.data);
      },
      /** 更新用户 */
      update(data?: User, signal?: AbortSignal): Promise<User> {
        return http({
          url: host + "/1/ms/user/update",
          method: "post",
          headers: { "Content-Type": "application/json" },
          data,
          signal,
        }).then((res) => res.data.data);
      },
      /** 管理员-更新用户账号(需要传id和account字段) */
      updateAccount(data?: User, signal?: AbortSignal): Promise<boolean> {
        return http({
          url: host + "/1/ms/user/update_account",
          method: "post",
          headers: { "Content-Type": "application/json" },
          data,
          signal,
        }).then((res) => res.data.data);
      },
      /** 管理员-更新用户名(需要传id和full_name字段) */
      updateFullname(data?: User, signal?: AbortSignal): Promise<boolean> {
        return http({
          url: host + "/1/ms/user/update_fullname",
          method: "post",
          headers: { "Content-Type": "application/json" },
          data,
          signal,
        }).then((res) => res.data.data);
      },
      /** 管理员-更新用户手机号(需要传id和mobile字段) */
      updateMobile(data?: User, signal?: AbortSignal): Promise<boolean> {
        return http({
          url: host + "/1/ms/user/update_mobile",
          method: "post",
          headers: { "Content-Type": "application/json" },
          data,
          signal,
        }).then((res) => res.data.data);
      },
      /** 管理员-更新用户登录密码（需传id和password字段） */
      updatePassword(data?: User, signal?: AbortSignal): Promise<boolean> {
        return http({
          url: host + "/1/ms/user/update_password",
          method: "post",
          headers: { "Content-Type": "application/json" },
          data,
          signal,
        }).then((res) => res.data.data);
      },
    },
    userRole: {
      /** 添加用户(包括角色) */
      add(data?: UserRoleDTO, signal?: AbortSignal): Promise<UserRoleDTO> {
        return http({
          url: host + "/1/ms/user_role/add",
          method: "post",
          headers: { "Content-Type": "application/json" },
          data,
          signal,
        }).then((res) => res.data.data);
      },
      /** 删除用户(包括角色) */
      delete(data?: UserRoleDTO, signal?: AbortSignal): Promise<boolean> {
        return http({
          url: host + "/1/ms/user_role/delete",
          method: "post",
          headers: { "Content-Type": "application/json" },
          data,
          signal,
        }).then((res) => res.data.data);
      },
      /** 按分页查询用户列表(包括角色) */
      pageList(
        params: {
          /** 用户账号 */
          account?: string,
          /** 用户名称 */
          full_name?: string,
          /** 手机号码 */
          mobile?: string,
          /** 页码 */
          page_no?: number,
          /** 页面容量 */
          page_size?: number,
        },
        signal?: AbortSignal
      ): Promise<PageList<UserRoleDTO>> {
        return http({
          url: host + "/1/ms/user_role/page_list",
          method: "get",
          headers: { "Content-Type": "application/json" },
          params,
          signal,
        }).then((res) => res.data.data);
      },
      /** 更新用户(包括角色) */
      update(data?: UserRoleDTO, signal?: AbortSignal): Promise<UserRoleDTO> {
        return http({
          url: host + "/1/ms/user_role/update",
          method: "post",
          headers: { "Content-Type": "application/json" },
          data,
          signal,
        }).then((res) => res.data.data);
      },
    },
    yunfile: {
      /** 前端上传文件 */
      fUpload(
        params: {
          /** 是否需要登录 */
          need_login: boolean,
        },
        data?: FormData,
        signal?: AbortSignal
      ): Promise<FileLocation> {
        return http({
          url: host + "/1/ms/yunfile/f_upload",
          method: "post",
          headers: { "Content-Type": "multipart/form-data" },
          params,
          data,
          signal,
        }).then((res) => res.data.data);
      },
      /** 前端上传文件(BASE64) */
      fUploadBase64(
        params: {
          /** 是否需要登录 */
          need_login: boolean,
        },
        data?: string,
        signal?: AbortSignal
      ): Promise<FileLocation> {
        return http({
          url: host + "/1/ms/yunfile/f_upload_base64",
          method: "post",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          params,
          data,
          signal,
        }).then((res) => res.data.data);
      },
      /** 前端分片上传文件 */
      fUploadChunk(
        params: {
          /** chunk */
          chunk: number,
          /** chunks */
          chunks: number,
          /** size */
          size: string,
          /** 是否需要登录 */
          need_login: boolean,
        },
        data?: FormData,
        signal?: AbortSignal
      ): Promise<FileLocation> {
        return http({
          url: host + "/1/ms/yunfile/f_upload_chunk",
          method: "post",
          headers: { "Content-Type": "multipart/form-data" },
          params,
          data,
          signal,
        }).then((res) => res.data.data);
      },
      /** 文件列表 */
      list(
        params: {
          /** 查询条件 */
          query?: string,
          /** 页码 */
          page_no: number,
          /** 数量 */
          page_size: number,
        },
        signal?: AbortSignal
      ): Promise<PageList<FileMetadata>> {
        return http({
          url: host + "/1/ms/yunfile/list",
          method: "get",
          headers: { "Content-Type": "application/json" },
          params,
          signal,
        }).then((res) => res.data.data);
      },
      /** 文件上传凭证 */
      token(
        params: {
          /** type */
          type?: number,
          /** location */
          location?: number,
        },
        signal?: AbortSignal
      ): Promise<string> {
        return http({
          url: host + "/1/ms/yunfile/token",
          method: "get",
          headers: { "Content-Type": "application/json" },
          params,
          signal,
        }).then((res) => res.data.data);
      },
    },
  },
};

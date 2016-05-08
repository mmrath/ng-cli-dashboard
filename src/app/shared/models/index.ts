export class PageRequest {
  page: number = 0;
  size: number = 20;
  sort: Array<Order> = new Array<Order>();
}

export class Order {
  public static get ASC(): string { return 'asc'; }
  public static get DESC(): string { return 'desc'; }

  property: string;
  direction: string;
}

export interface Page<T>{
  content: Array<T>;
  last: boolean;
  totalPages: number;
  totalElements: number;
  size: number;
  number: number; // Page number
  first: boolean;
  numberOfElements: number; // Number of elements in current page
}

export interface Resource {
  id: number;
  name: string;
  description: string;
}

export interface Permission {
  id: number;
  name: string;
  resource: Resource;
  accessLevel: string;
  description: string;
  selected: boolean;
}

export interface Role {
  id: number;
  name: string;
  description: string;
  version: number;
  permissions: Array<Permission>;
}

export interface User {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  version: number;
  roles: Array<Role>;
}

export interface ColumnDef {
  id?: number;
  index?: number;
  codeName?: string;
  columnName?: string;
  displayLabel?: string;
  dataType?: string;
  columnType?: string;
  searchable?: boolean;
  sortable?: boolean;
  showInList?: boolean;
  dataTemplate?: string;
  headerTemplate?: string;
}

export interface TableDef {
  id: number;
  codeName: string;
  tableName: string;
  displayLabel: string;
  insertable: boolean;
  updatable: boolean;
  deletable: boolean;
  multiSelectable: boolean;
  primaryKeyColumn: ColumnDef;
  columns: Array<ColumnDef>;
}

import {Component} from '@angular/core';
import {Router, OnActivate, RouteSegment, Tree, ROUTER_DIRECTIVES} from '@angular/router';
import {Observable} from 'rxjs/Observable';

import {RoleService} from './shared';
import {PermissionService} from './shared';
import {Role, Permission, Resource} from '../shared/models';


@Component({
  moduleId: module.id,
  selector: 'role-edit',
  providers: [RoleService, PermissionService],
  templateUrl: 'role-edit.component.html',
  directives: [ROUTER_DIRECTIVES],
})
export class RoleEditComponent implements OnActivate {
  isNew: boolean;
  id: number;
  role: Role = {
    id: undefined,
    name: '',
    description: '',
    version: 0,
    permissions: new Array<Permission>()
  };
  accessLevels: Array<string>;
  resources: Array<Resource>;
  permissionGroups: Map<number, Map<string, Permission>>;
  selectAllAccessLevel: Map<string, boolean> = new Map<string, boolean>();
  errorMessages: Array<string> = new Array();
  constructor(
    private roleService: RoleService,
    private permissionService: PermissionService,
    private router: Router) {
  }

  routerOnActivate(curr: RouteSegment, prev?: RouteSegment, currTree?: Tree<RouteSegment>,
    prevTree?: Tree<RouteSegment>): void {

    let paramId = curr.getParam('id');

    if (typeof paramId === 'undefined' || paramId == 'new') {
      this.isNew = true;
    } else {
      this.isNew = false;
      this.id = +paramId;
    }

    var accessLevelsObs = this.permissionService.findAllAccessLevels();
    var resourcesObs = this.permissionService.findAllResources();
    var permissionGroupsObs = this.permissionService.findAllPermissionGroups();
    accessLevelsObs.subscribe(res => {
      this.accessLevels = res;
    });
    resourcesObs.subscribe(res => {
      this.resources = res;
    }, err => { console.error('Error ' + err); });
    permissionGroupsObs.subscribe(res => {
      this.permissionGroups = res;
      console.log('Got all permissions');
      this.updatePermissionSelectStatus();
    }, err => { console.error('Error permissionGroups' + err); });
    if (!this.isNew) {
      this.roleService.findOne(this.id).subscribe(res => {
        console.log('Got role');
        this.role = res;
        this.updatePermissionSelectStatus();
      }, err => { console.log('Error ' + err); });
    }
  }

  isValidPermission(resourceIn: Resource, accessLevel: string): boolean {
    var returnVal = false;
    if (typeof this.permissionGroups !== 'undefined') {
      if (resourceIn.id in this.permissionGroups) {
        if (accessLevel in this.permissionGroups[resourceIn.id]) {
          returnVal = true;
        }
      }
    }
    return returnVal;
  }

  toggleSelectAllResource(event: Event, accessLevel: string) {
    var selectAll = false;
    if (event.target['checked']) {
      selectAll = true;
    }
    if (typeof this.permissionGroups === 'undefined' || typeof this.resources === 'undefined') {
      return;
    }
    for (var resource of this.resources) {
      if (resource.id in this.permissionGroups
        && accessLevel in this.permissionGroups[resource.id]) {
        this.permissionGroups[resource.id][accessLevel].selected = selectAll;
      }
    }
  }

  resetSelectAll(event: Event, accessLevel: string) {
    if (!event.target['checked']) {
      this.selectAllAccessLevel[accessLevel] = false;
    }
  }

  closeErrorMessage(i: number) {
    this.errorMessages.splice(i, 1);
  }

  onSubmit() {
    var selectedPerms = new Array<Permission>();
    for (var resource of this.resources) {
      if (typeof this.permissionGroups !== 'undefined' && resource.id in this.permissionGroups) {
        for (var accessLevel of this.accessLevels) {
          if (accessLevel in this.permissionGroups[resource.id] &&
            this.permissionGroups[resource.id][accessLevel].selected) {
            selectedPerms.push(this.permissionGroups[resource.id][accessLevel]);
          }
        }
      }
    }
    this.role.permissions = selectedPerms;
    this.errorMessages = new Array<string>();
    var obsRole: Observable<Role>;
    if (this.isNew) {
      obsRole = this.roleService.save(this.role);
    } else {
      obsRole = this.roleService.update(this.role.id, this.role);
    }
    obsRole.subscribe(
      res => {
        console.log('Success');
        this.router.navigate(['role']);
      },
      err => {
        if (typeof err['_body'] !== 'undefined') {
          var body = JSON.parse(err['_body']);
          this.errorMessages = new Array();
          if (typeof body.errors !== 'undefined') {
            for (let error of body.errors) {
              this.errorMessages.push(error.message);
            }
          }
          if (typeof body.fieldErrors !== 'undefined') {
            for (let error of body.fieldErrors) {
              this.errorMessages.push(error.message);
            }
          }
        }
         console.log('Error' + err);
      });
}

  private updatePermissionSelectStatus() {
  if (typeof this.permissionGroups === 'undefined'
    || typeof this.role.permissions === 'undefined') {
    console.log('Not updating select status');
    return;
  }
  console.log('Updating select status');
  for (var permission of this.role.permissions) {
    if (permission.resource.id in this.permissionGroups) {
      if (permission.accessLevel in this.permissionGroups[permission.resource.id]) {
        this.permissionGroups[permission.resource.id][permission.accessLevel].selected = true;
      }
    }
  }
}
}

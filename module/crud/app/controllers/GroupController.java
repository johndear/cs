package controllers;

import annotation.Menu;
import models.TGroup;

@Menu(name="用户组管理", category="权限管理")
@CRUD.For(TGroup.class)
public class GroupController extends CRUD {

}

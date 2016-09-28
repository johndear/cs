package controllers;

import models.TGroup;
import play.mvc.Controller;
import utils.Menu;

@Menu(name="用户组管理", category="权限管理")
@CRUD.For(TGroup.class)
public class GroupController extends CRUD {

}

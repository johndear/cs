package controllers;

import models.TAction;
import models.TGroup;
import play.mvc.Controller;
import utils.Menu;

@Menu(name="操作管理", category="权限管理")
@CRUD.For(TAction.class)
public class ActionController extends CRUD {

}

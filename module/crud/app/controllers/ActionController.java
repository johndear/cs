package controllers;

import annotation.Menu;
import models.TAction;

@Menu(name="操作管理", category="权限管理")
@CRUD.For(TAction.class)
public class ActionController extends CRUD {

}

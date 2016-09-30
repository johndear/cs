package controllers;

import play.mvc.With;
import utils.Menu;
import utils.Rest;

@With(Secure.class)
@Menu(name="角色管理", category="权限管理")
public class TRoles extends CRUD {

}

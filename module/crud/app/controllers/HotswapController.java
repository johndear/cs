package controllers;

import models.HotswapBean;
import play.mvc.*;
import utils.Menu;

@Menu(name="热部署", category="demo")
@CRUD.For(HotswapBean.class)
public class HotswapController extends CRUD {


}

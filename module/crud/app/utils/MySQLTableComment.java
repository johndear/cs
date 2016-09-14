package utils;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import play.Play;

/**
 * 读取mysql某数据库下表的注释信息
 * 
 * @author xxx
 */
public class MySQLTableComment {
	
	static String url=Play.configuration.getProperty("db.url","jdbc:mysql://yftest.ucweb.local:3306/mysql?characterEncoding=UTF-8&useUnicode=true&useOldAliasMetadataBehavior=true");
	static String username=Play.configuration.getProperty("db.user","root");
	static String password=Play.configuration.getProperty("db.pass","root");
	
	public static Connection getMySQLConnection() throws Exception {
		Class.forName("com.mysql.jdbc.Driver");
		Connection conn = DriverManager.getConnection(url, username, password);
		return conn;
	}
	

	/**
	 * 获取当前数据库下的所有表名称
	 * @return
	 * @throws Exception
	 */
	public static List getAllTableName() throws Exception {
		List tables = new ArrayList();
		Connection conn = getMySQLConnection();
		Statement stmt = conn.createStatement();
		ResultSet rs = stmt.executeQuery("SHOW TABLES ");
		while (rs.next()) {
			String tableName = rs.getString(1);
			tables.add(tableName);
		}
		rs.close();
		stmt.close();
		conn.close();
		return tables;
	}
	

	/**
	 * 获得某表的建表语句
	 * @param tableName
	 * @return
	 * @throws Exception
	 */
	public static Map getCommentByTableName(List tableName) throws Exception {
		Map map = new HashMap();
		Connection conn = getMySQLConnection();
		Statement stmt = conn.createStatement();
		for (int i = 0; i < tableName.size(); i++) {
			String table = (String) tableName.get(i);
			ResultSet rs = stmt.executeQuery("SHOW CREATE TABLE " + table);
			if (rs != null && rs.next()) {
				String createDDL = rs.getString(2);
				String comment = parse(createDDL);
				map.put(table, comment);
			}
			rs.close();
		}
		stmt.close();
		conn.close();
		return map;
	}
	/**
	 * 获得某表中所有字段的注释
	 * @param tableName
	 * @return
	 * @throws Exception
	 */
	public static Map<String, Map<String,Object>> getColumnCommentByTableName(List tableName) throws Exception {
		Map<String, Map<String,Object>> tables = new HashMap<String, Map<String,Object>>();
		Connection conn = getMySQLConnection();
		Statement stmt = conn.createStatement();
		for (int i = 0; i < tableName.size(); i++) {
			String table = (String) tableName.get(i);
			System.out.println("【"+table+"】");

			Map<String, Object> fields = new HashMap<String, Object>();
			tables.put(table, fields);
			
			ResultSet rs = stmt.executeQuery("show full columns from " + table);
		    while (rs.next()) {   
			    System.out.println(StringUtil.underlineToCamel(rs.getString("Field")) + "\t:\t"+  rs.getString("Comment") );
			    fields.put(StringUtil.underlineToCamel(rs.getString("Field")), rs.getString("Comment"));
			} 
			rs.close();
		}
		stmt.close();
		conn.close();
		return tables;
	}

	

	/**
	 * 返回注释信息
	 * @param all
	 * @return
	 */
	
	public static String parse(String all) {
		String comment = null;
		int index = all.indexOf("COMMENT='");
		if (index < 0) {
			return "";
		}
		comment = all.substring(index + 9);
		comment = comment.substring(0, comment.length() - 1);
		return comment;
	}

	public static void main(String[] args) throws Exception {
		List tables = getAllTableName();
		Map tablesComment = getCommentByTableName(tables);
		Set names = tablesComment.keySet();
		Iterator iter = names.iterator();
		while (iter.hasNext()) {
			String name = (String) iter.next();
			System.out.println("Table Name: " + name + ", Comment: " + tablesComment.get(name));
		}
		
		getColumnCommentByTableName(tables);
	}
}
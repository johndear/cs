package services;

import java.sql.Connection;
import java.sql.ResultSet;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import utils.JdbcUtils;

public class ResourceService {

	private static String query_sql = "select order_no from t_resource where code=?";

	public static List<Map<String, String>> query(String code) throws Exception {
		Connection conn = JdbcUtils.getConnection();
		ResultSet rs = JdbcUtils.query(JdbcUtils.getConnection(), query_sql, code);
		
		
		List<Map<String, String>> list = new ArrayList<Map<String, String>>();
		while (rs.next()) {
			String job_name = rs.getString("order_no");

			Map<String, String> map = new HashMap<String, String>();
			map.put("orderNo", job_name);
			list.add(map);
		}

		rs.close();
		conn.close();

		return list;
	}
}

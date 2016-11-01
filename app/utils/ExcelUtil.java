package utils;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFCellStyle;
import org.apache.poi.hssf.usermodel.HSSFDataFormat;
import org.apache.poi.hssf.usermodel.HSSFFont;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.hssf.util.HSSFColor;
import org.apache.poi.ss.usermodel.DataFormat;

import play.Logger;
import play.Play;
import play.mvc.Http;

public class ExcelUtil {
    
	/**
	 * Excel中，当数字的长度大于等于12时，会转成科学技术法，这里定义最长长度，用于数字长度判断
	 */
	public static final int MAX_LENGTH = 12;

	public static File generateExcel(Http.Response response, String exlName,
                                     List<Map<String, String>> dataMapList) throws FileNotFoundException {
        response.contentType = "text/plain";
        try {
            String fileName = URLEncoder.encode(exlName, "UTF-8");
            response.setHeader("Content-Disposition", "attachment; filename=" + fileName + ".xls");
        } catch (UnsupportedEncodingException e1) {
            Logger.error("[DataCountController.generateExcel]编码不支持错误。%s", e1.getMessage());
        }

        List<String> headList = new ArrayList<String>();
        if(dataMapList != null && dataMapList.size()>0){
            Map<String, String> map = dataMapList.get(0);
            for(Map.Entry entry : map.entrySet()){
                String headKey = (String)entry.getKey();
                headList.add(headKey);
            }
        }

        BufferedOutputStream buff = null;
        try {
            HSSFWorkbook workbook = new HSSFWorkbook();
            HSSFSheet sheet = workbook.createSheet();
            workbook.setSheetName(0, exlName);
            HSSFCellStyle style = workbook.createCellStyle();
            sheet.setDefaultColumnWidth((short) 14);
            HSSFFont font = workbook.createFont();
            font.setColor(HSSFColor.BLACK.index);
            font.setFontHeightInPoints((short) 12);
            font.setBoldweight(HSSFFont.BOLDWEIGHT_BOLD);
            HSSFRow row = sheet.createRow((short) 0);
            buff = new BufferedOutputStream(response.out);
            // 头部字体样式
            style.setFont(font);
            // 头部字体居中
            style.setAlignment(HSSFCellStyle.ALIGN_LEFT);
            // 头部字体颜色
            style.setFillForegroundColor((short) 13);
            style.setFillPattern(HSSFCellStyle.SOLID_FOREGROUND);

            for (short i = 0; i < headList.size(); i++) {
                HSSFCell headCell = row.createCell(i);
                headCell.setCellValue(headList.get(i));
                headCell.setCellStyle(style);
            }

            HSSFCellStyle styleCont = workbook.createCellStyle();
            styleCont.setAlignment(HSSFCellStyle.ALIGN_LEFT);
            styleCont.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);// 垂直
            
            //设置数字格式
            HSSFCellStyle styleNumber = workbook.createCellStyle();
            styleNumber.setDataFormat(HSSFDataFormat.getBuiltinFormat("0"));
            
            // 输出内容，外循环控制输出行数
            for (int j = 0; j < dataMapList.size(); j++) {
                // 创建行获取行元素
                Map<String, String> dataMap = dataMapList.get(j);
                HSSFRow rowd = sheet.createRow(j+1);

                List<String> datalist = new ArrayList<String>();
                for(String headStr : headList){
                	String dataStr = dataMap.get(headStr);
                    datalist.add(dataStr);
                }

                // 内循环控制每行输出元素
                for (int k=0; k < datalist.size(); k++) {
                    HSSFCell dataCell = rowd.createCell(k);
                    //判断当前单元格数据是否为数字
                    boolean flag = StringUtils.isNumeric(datalist.get(k));
                    
                    if(flag){//如果为数字，转为double类型，按照数字格式展示
                    	if(!"".equals(datalist.get(k))){
                    		if(datalist.get(k).length()>=MAX_LENGTH){
                    			dataCell.setCellValue(datalist.get(k));
                    		}else{
                    			dataCell.setCellValue(Double.parseDouble(datalist.get(k)));
                    		}
                    	}else{
                    		dataCell.setCellValue(datalist.get(k));
                    	}
                    	dataCell.setCellStyle(styleNumber);
                    }else{//如果是字符串，按照字符展示
                    	dataCell.setCellValue(datalist.get(k));
                    }
                    dataCell.setCellStyle(styleCont);
                }
            }

            // 目标文件路径
            String TARGET = Play.applicationPath.getPath() + File.separator + "tmp" + File.separator + exlName +"-@date.xls";
            String targetFile = TARGET.replace("@date",cn.uc.common.util.date.DateUtil.convertDateToStr(new Date(), "yyyyMMddHHmmss"));
            File file = new File(targetFile);
            if(!file.exists()){
                file.createNewFile();
            }
            FileOutputStream fileOut = new FileOutputStream(file);
            workbook.write(fileOut);
            buff.flush();
            buff.close();
            return file;

        } catch (Exception e) {
            Logger.error(e.getMessage(), e.getCause());
        } finally {
            try {
                buff.flush();
                buff.close();
            } catch (Exception e) {
                Logger.error(e.getMessage(), e.getCause());
            }
        }
        return null;
    }
}

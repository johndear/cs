package controllers;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.Enumeration;
import java.util.jar.JarEntry;
import java.util.jar.JarFile;

import models.HotswapBean;

import org.apache.commons.io.IOUtils;

import play.db.Model;
import play.db.jpa.Blob;
import play.mvc.With;
import utils.Position;
import annotation.Action;
import annotation.Menu;

@With(Secure.class)
@Menu(name="热部署", category="demo")
@CRUD.For(HotswapBean.class)
public class HotswapController extends CRUD {
	
	//解压jar包中的文件到toDir目录  
	@Check("HotswapBean:enabled")
	@Action(code="enabled", name="启用", position=Position.INNER)
    public static void enabled(String id, String field) throws Exception{
    	ObjectType type = ObjectType.get(getControllerClass());
        notFoundIfNull(type);
        Model object = type.findById(id);
        notFoundIfNull(object);
        Object att = object.getClass().getField(field).get(object);
        Model.BinaryField attachment = null;
        if(att instanceof Blob) {
        	Blob tempattachment = (Blob)att;
        	String fileName = tempattachment.getFile().getName();
        }
        if(att instanceof Model.BinaryField) {
            attachment = (Model.BinaryField)att;
            if (attachment == null || !attachment.exists()) {
                notFound();
            }
        } 
        
        File attachmentFolder = Blob.getStore();
        File sourceFile = new File(attachmentFolder.getPath() + "/test.jar");
        File targetFile = new File(attachmentFolder.getPath() + "/test");

        InputStream is = attachment.get();
        OutputStream os = new FileOutputStream(sourceFile);
        IOUtils.copy(is, os);

        unJar(sourceFile, targetFile);
    }
	
	//解压jar包中的文件到toDir目录  
	@Check("HotswapBean:unEnabled")
	@Action(code="unEnabled", name="停用", position=Position.INNER)
    public static void unEnabled(String id, String field) throws Exception{
		System.out.println("do unenabled...");
	}
	
	//解压jar包中的文件到toDir目录  
    private static void unJar(File jarFile, File toDir) throws IOException {  
        JarFile jar = new JarFile(jarFile);  
        try {  
            Enumeration entries = jar.entries();  
            while (entries.hasMoreElements()) {  
                JarEntry entry = (JarEntry) entries.nextElement();  
                if (!entry.isDirectory()) {  
                    InputStream in = jar.getInputStream(entry);  
                    try {  
                        File file = new File(toDir, entry.getName());  
                        if (!file.getParentFile().mkdirs()) {  
                            if (!file.getParentFile().isDirectory()) {  
                                throw new IOException(  
                                        "Mkdirs failed to create "  
                                                + file.getParentFile()  
                                                        .toString());  
                            }  
                        }  
                        OutputStream out = new FileOutputStream(file);  
                        try {  
                            byte[] buffer = new byte[8192];  
                            int i;  
                            while ((i = in.read(buffer)) != -1) {  
                                out.write(buffer, 0, i);  
                            }  
                        } finally {  
                            out.close();  
                        }  
                    } finally {  
                        in.close();  
                    }  
                }  
            }  
        } finally {  
            jar.close();  
        }  
    }  
    
    @Action(name="测试")
    public static void test(String id, String field) throws Exception{
    	
    }


}

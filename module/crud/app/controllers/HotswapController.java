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
import utils.Menu;

@Menu(name="热部署", category="demo")
@CRUD.For(HotswapBean.class)
public class HotswapController extends CRUD {
	
	//解压jar包中的文件到toDir目录  
    public static void enabled(String sourceFilePath, String destFilePath) throws IOException{
    	unJar(new File(sourceFilePath), new File(destFilePath));
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


}

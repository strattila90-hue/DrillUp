package hu.strattila90.corequest;

import android.content.Intent;
import android.content.pm.PackageInfo;
import android.net.Uri;
import android.os.Build;
import android.provider.Settings;

import androidx.core.content.FileProvider;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;

/**
 * Az app (APK) önálló frissítése: letölti az új APK-t a GitHub-kiadásból, és megnyitja az Android telepítőjét.
 * Csak https-ről tölt; a telepítést mindig a felhasználó hagyja jóvá (rendszer-párbeszéd).
 * Ha az „ismeretlen forrásból telepítés” nincs engedélyezve az appnak, a beállítás oldalát nyitja meg.
 */
@CapacitorPlugin(name = "ApkUpdater")
public class ApkUpdater extends Plugin {

    private boolean canInstall() {
        return Build.VERSION.SDK_INT < 26 || getContext().getPackageManager().canRequestPackageInstalls();
    }

    @PluginMethod
    public void info(PluginCall call) {
        try {
            PackageInfo pi = getContext().getPackageManager().getPackageInfo(getContext().getPackageName(), 0);
            long vc = Build.VERSION.SDK_INT >= 28 ? pi.getLongVersionCode() : pi.versionCode;
            JSObject r = new JSObject();
            r.put("versionCode", vc);
            r.put("versionName", pi.versionName);
            r.put("canInstall", canInstall());
            call.resolve(r);
        } catch (Exception e) {
            call.reject(String.valueOf(e.getMessage()));
        }
    }

    @PluginMethod
    public void install(PluginCall call) {
        final String url = call.getString("url");
        if (url == null || !url.startsWith("https://")) {
            call.reject("bad url");
            return;
        }
        if (!canInstall()) {
            Intent s = new Intent(Settings.ACTION_MANAGE_UNKNOWN_APP_SOURCES, Uri.parse("package:" + getContext().getPackageName()));
            s.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            getContext().startActivity(s);
            call.reject("permission", "PERMISSION");
            return;
        }
        new Thread(() -> {
            HttpURLConnection c = null;
            try {
                File f = new File(getContext().getCacheDir(), "update.apk");
                URL u = new URL(url);
                for (int hop = 0; ; hop++) {
                    c = (HttpURLConnection) u.openConnection();
                    c.setInstanceFollowRedirects(false);
                    c.setConnectTimeout(15000);
                    c.setReadTimeout(30000);
                    int code = c.getResponseCode();
                    if (code >= 300 && code < 400 && hop < 6) {
                        URL next = new URL(u, c.getHeaderField("Location"));
                        c.disconnect();
                        if (!"https".equals(next.getProtocol())) throw new Exception("insecure redirect");
                        u = next;
                        continue;
                    }
                    if (code != 200) throw new Exception("HTTP " + code);
                    break;
                }
                long total = c.getContentLengthLong(), done = 0, last = 0;
                try (InputStream in = c.getInputStream(); OutputStream out = new FileOutputStream(f)) {
                    byte[] b = new byte[65536];
                    int n;
                    while ((n = in.read(b)) > 0) {
                        out.write(b, 0, n);
                        done += n;
                        if (total > 0 && done - last > total / 40) {
                            last = done;
                            JSObject p = new JSObject();
                            p.put("p", (double) done / total);
                            notifyListeners("progress", p);
                        }
                    }
                }
                Uri uri = FileProvider.getUriForFile(getContext(), getContext().getPackageName() + ".fileprovider", f);
                Intent i = new Intent(Intent.ACTION_VIEW);
                i.setDataAndType(uri, "application/vnd.android.package-archive");
                i.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION | Intent.FLAG_ACTIVITY_NEW_TASK);
                getContext().startActivity(i);
                call.resolve();
            } catch (Exception e) {
                call.reject(String.valueOf(e.getMessage()));
            } finally {
                if (c != null) c.disconnect();
            }
        }).start();
    }
}

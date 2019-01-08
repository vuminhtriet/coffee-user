package com.gts.drinkaway;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.oblador.vectoricons.VectorIconsPackage;
import fr.bamlab.rnimageresizer.ImageResizerPackage;
import com.imagepicker.ImagePickerPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.masteratul.exceptionhandler.ReactNativeExceptionHandlerPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import io.invertase.firebase.RNFirebasePackage;
import com.lwansbrough.RCTCamera.RCTCameraPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.airbnb.android.react.maps.MapsPackage;

import java.util.Arrays;
import java.util.List;

import io.invertase.firebase.RNFirebasePackage;
import io.invertase.firebase.auth.RNFirebaseAuthPackage;
import io.invertase.firebase.storage.RNFirebaseStoragePackage;
import io.invertase.firebase.firestore.RNFirebaseFirestorePackage;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new VectorIconsPackage(),
            new ImageResizerPackage(),
            new ImagePickerPackage(),
            new RNGestureHandlerPackage(),
            new ReactNativeExceptionHandlerPackage(),
            new RNDeviceInfo(),
            new RNFirebasePackage(),
            new RNFirebaseAuthPackage(),
            new RNFirebaseFirestorePackage(),
            new RNFirebaseStoragePackage(),
            new RCTCameraPackage(),
            new MapsPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}

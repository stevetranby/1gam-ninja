/****************************************************************************
Copyright (c) 2010-2012 cocos2d-x.org

http://www.cocos2d-x.org

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
****************************************************************************/
package com.stevetranby.ninja;

import org.cocos2dx.lib.Cocos2dxActivity;
import org.cocos2dx.lib.Cocos2dxGLSurfaceView;

import tv.ouya.console.*;
import tv.ouya.console.api.OuyaController;
import tv.ouya.console.api.OuyaFacade;

import android.app.AlertDialog;
import android.content.DialogInterface;
import android.os.Bundle;
import android.util.Log;
import android.view.KeyEvent;
import android.view.MotionEvent;

public class ninja extends Cocos2dxActivity{
	
	private static final String TAG = ninja.class.getSimpleName();
	
	private boolean isOuya;
	public Cocos2dxGLSurfaceView mGLView;
	
	protected void onCreate(Bundle savedInstanceState){
		super.onCreate(savedInstanceState);
		isOuya = OuyaFacade.getInstance().isRunningOnOUYAHardware();
		if(isOuya) 
			OuyaController.init(this);
	}

	public Cocos2dxGLSurfaceView onCreateView() {
		mGLView = new Cocos2dxGLSurfaceView(this);
		// should create stencil buffer
		mGLView.setEGLConfigChooser(5, 6, 5, 0, 16, 8);
		return mGLView;
	}
	
	@Override
    public boolean onKeyDown(final int keyCode, KeyEvent event) {
        boolean handled = false;
        
        Log.d(TAG, "keycode = " + keyCode);
        if(isOuya) 
        	handled = OuyaController.onKeyDown(keyCode, event);
		Log.d(TAG, "device id = " + event.getDeviceId());

		// top: ouya-O, normal-A
		// top: ouya-U, normal-X
		// top: ouya-Y, normal-Y
		// top: ouya-A, normal-B
		
		int codeButtonB = android.view.KeyEvent.KEYCODE_BUTTON_B; // normal B button is right button
		if(isOuya)
			codeButtonB = OuyaController.BUTTON_A; // ouya_A is right button
		
        if (keyCode == codeButtonB) {
        	AlertDialog ad = new AlertDialog.Builder(this)
			.setTitle("EXIT?")
			.setMessage("Do you really want to exit?")
			.setPositiveButton("YES",
                               new DialogInterface.OnClickListener() {
                public void onClick(DialogInterface dialog, int which) {
                    android.os.Process.killProcess(android.os.Process.myPid());
                    //myActivity.finish();
                }
            })
			.setNegativeButton("NO",
                               new DialogInterface.OnClickListener() {
                public void onClick(DialogInterface dialog, int which) {

                }
            }).create();
        	ad.show();
        }

        Log.d(TAG, "try to send key " + keyCode + " to native");

		this.mGLView.queueEvent(new Runnable() {
			@Override
			public void run() {
				Log.d(TAG, "sending key " + keyCode + " down to native");
				ninja.this.mGLView.mCocos2dxRenderer.handleKeyDown(keyCode);
			}
		});

        return handled || super.onKeyDown(keyCode, event);
    }

    @Override
    public boolean onKeyUp(final int keyCode, KeyEvent event) {
		boolean handled = false;
		Log.d(TAG, "keyup code = " + keyCode);
		if(isOuya) 
			handled = OuyaController.onKeyUp(keyCode, event);
		Log.d(TAG, "device id = " + event.getDeviceId());
		
		Log.d(TAG, "try to send keyup " + keyCode + " to native");

		this.mGLView.queueEvent(new Runnable() {
			@Override
			public void run() {
				Log.d(TAG, "sending keyup " + keyCode + " to native");
				ninja.this.mGLView.mCocos2dxRenderer.handleKeyUp(keyCode);
			}
		});
		
		return handled || super.onKeyUp(keyCode, event);
	}

    //@Override
    public boolean onGenericMotionEvent(MotionEvent event) {
        boolean handled = false;
        if(isOuya) {
			handled = OuyaController.onGenericMotionEvent(event);

			OuyaController c = OuyaController.getControllerByDeviceId(event.getDeviceId());
			if (c != null) {
				// Log.d(TAG, "x = " +
				// c.getAxisValue(OuyaController.AXIS_LS_X));
				// Log.d(TAG, "y = " +
				// c.getAxisValue(OuyaController.AXIS_LS_Y));
			}
        }
        return handled;// || super.onGenericMotionEvent(event);
    }
    
    static {
        System.loadLibrary("cocos2djs");
    }
}

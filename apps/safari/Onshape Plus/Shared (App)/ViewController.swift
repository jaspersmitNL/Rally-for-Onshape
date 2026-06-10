//
//  ViewController.swift
//  Shared (App)
//
//  Created by Riley Davidson-Evans on 2026-06-05.
//

import WebKit

#if os(iOS)
import UIKit
typealias PlatformViewController = UIViewController
#elseif os(macOS)
import Cocoa
import SafariServices
typealias PlatformViewController = NSViewController
#endif

let extensionBundleIdentifier = "com.rileydavidson.onshapeplus.Extension"

class ViewController: PlatformViewController, WKNavigationDelegate, WKScriptMessageHandler {

    @IBOutlet var webView: WKWebView!

    override func viewDidLoad() {
        super.viewDidLoad()

    #if os(iOS)
        let backgroundColor = UIColor(
            red: 9.0 / 255.0,
            green: 11.0 / 255.0,
            blue: 17.0 / 255.0,
            alpha: 1.0
        )

        view.backgroundColor = backgroundColor
        webView.backgroundColor = backgroundColor
        webView.scrollView.backgroundColor = backgroundColor
        webView.isOpaque = false
    #endif

        webView.navigationDelegate = self

    #if os(iOS)
        webView.scrollView.isScrollEnabled = false
    #endif

        webView.configuration.userContentController.add(self, name: "controller")

        webView.loadFileURL(
            Bundle.main.url(forResource: "Main", withExtension: "html")!,
            allowingReadAccessTo: Bundle.main.resourceURL!
        )
    }

    // Open Onshape links in Safari instead of inside the app's WKWebView
    func webView(
        _ webView: WKWebView,
        decidePolicyFor navigationAction: WKNavigationAction,
        decisionHandler: @escaping (WKNavigationActionPolicy) -> Void
    ) {
    #if os(iOS)
        if let url = navigationAction.request.url,
           let host = url.host,
           host.contains("onshape.com") {

            UIApplication.shared.open(url)
            decisionHandler(.cancel)
            return
        }
    #endif

        decisionHandler(.allow)
    }

    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
    #if os(iOS)
        webView.evaluateJavaScript("show('ios')")
    #elseif os(macOS)
        webView.evaluateJavaScript("show('mac')")

        SFSafariExtensionManager.getStateOfSafariExtension(
            withIdentifier: extensionBundleIdentifier
        ) { (state, error) in
            guard let state = state, error == nil else {
                return
            }

            DispatchQueue.main.async {
                if #available(macOS 13, *) {
                    webView.evaluateJavaScript(
                        "show('mac', \(state.isEnabled), true)"
                    )
                } else {
                    webView.evaluateJavaScript(
                        "show('mac', \(state.isEnabled), false)"
                    )
                }
            }
        }
    #endif
    }

    func userContentController(
        _ userContentController: WKUserContentController,
        didReceive message: WKScriptMessage
    ) {
    #if os(macOS)
        if (message.body as! String != "open-preferences") {
            return
        }

        SFSafariApplication.showPreferencesForExtension(
            withIdentifier: extensionBundleIdentifier
        ) { error in
            guard error == nil else {
                return
            }

            DispatchQueue.main.async {
                NSApp.terminate(self)
            }
        }
    #endif
    }
}
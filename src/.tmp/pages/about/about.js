import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
export var AboutPage = (function () {
    function AboutPage(navCtrl) {
        this.navCtrl = navCtrl;
    }
    AboutPage.decorators = [
        { type: Component, args: [{
                    selector: 'page-about',
                    templateUrl: 'about.html'
                },] },
    ];
    /** @nocollapse */
    AboutPage.ctorParameters = [
        { type: NavController, },
    ];
    return AboutPage;
}());

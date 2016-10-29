import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
export var ContactPage = (function () {
    function ContactPage(navCtrl) {
        this.navCtrl = navCtrl;
    }
    ContactPage.decorators = [
        { type: Component, args: [{
                    selector: 'page-contact',
                    templateUrl: 'contact.html'
                },] },
    ];
    /** @nocollapse */
    ContactPage.ctorParameters = [
        { type: NavController, },
    ];
    return ContactPage;
}());

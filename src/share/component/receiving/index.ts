import {FormGroup, FormControl, Validators} from '@angular/forms';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import {Component, OnInit, Input, ViewChild, Output, EventEmitter} from '@angular/core';
import {TypeInfo} from 'UltraCreation/Core/TypeInfo';
import {THttpClient} from 'UltraCreation/Core/Http';
import {Types, TAuthService} from 'services';
import {NgbModal} from 'share/modal';

@Component({ selector: 'receiv', templateUrl: './index.html' })

export class ReceivingComponent implements OnInit
{
    constructor(private Auth: TAuthService, private Modal: NgbModal)
    {
    }

    ngOnInit()
    {

        this.DeliveryForm();

        this.Auth.Addresses().then(list =>
        {
            this.AddressList = list;

            if (TypeInfo.Assigned(this.Auth.DefaultAddress))
            {
                this.Selected = this.Auth.DefaultAddress;
            }

        })
        .catch(err =>
        {

        });

        /*
        this.Http.Get('/assets/citylist_en.json').toPromise()
            .then(res =>
            {
                let Result = [];
                this.JSONObject = res.Content;
                for (let key in res.Content)
                    Result.push(key);
                this.CountryList = Result.sort();
            })
            .catch(() => {});
        */

        this.SearchCountry = (input: Observable<string>) =>
            input.debounceTime(200)
                .distinctUntilChanged()
                .map(term => term === '' ? []
                    : this.CountryList
                        .filter(v => v.toLowerCase().substr(0, term.length) === term.toLowerCase()).slice(0, 10));
        this.SearchCity = (input: Observable<string>) =>
            input.debounceTime(200)
                .distinctUntilChanged()
                .map(term => term === '' ? []
                    : this.CityList
                        .filter(v => v.toLowerCase().substr(0, term.length) === term.toLowerCase()).slice(0, 10));
    }

    OpenModal(ModalContent: Object, data?: any): void
    {
        this.ModalAddress = new Object() as any;

        if (TypeInfo.Assigned(data))
        {
            this.ModalTitle = App.Translate('profile.delivery.edit');
            Object.assign(this.ModalAddress, data);
        }
        else
            this.ModalTitle = App.Translate('profile.delivery.new');

        this.Modal.Open(ModalContent).result
            .then(ok =>
            {
                if (TypeInfo.Assigned(data))
                    return this.Auth.UpdateAddress(this.ModalAddress);
                else
                    return this.Auth.AppendAddress(this.ModalAddress);
            })
            .then(list => {
                this.AddressList = list;
                if (TypeInfo.Assigned(this.Auth.DefaultAddress)) this.Selected = this.Auth.DefaultAddress;
            })
            .catch(err => console.log(err));
    }

    Remove(item): void
    {
        if (confirm('Are you sure to delete')) {
            console.log('Implement delete functionality here');
          }
        // this.Auth.RemoveAddress(item)
        //     .then(() => this.AddressList.splice(this.AddressList.indexOf(item), 1))
        //     .catch(err => console.log(err));
    }

    DeliveryForm()
    {
        this.Delivery = new FormGroup({
            'Recipient': new FormControl(this.DeliveryControlName.Recipient, [Validators.required, Validators.minLength(2)]),
            'Tel': new FormControl(this.DeliveryControlName.Tel, [Validators.required, Validators.pattern(/^1[34578]\d{9}$/)]),
            'Country': new FormControl(this.DeliveryControlName.Country, Validators.required),
            'City': new FormControl(this.DeliveryControlName.City, Validators.required),
            'Street': new FormControl(this.DeliveryControlName.Street, Validators.required),
            'Zip': new FormControl(this.DeliveryControlName.Zip, Validators.required)
        });
    }

    SetDefault(addr): void
    {
        this.Auth.SetDefaultAddress(addr)
            .then(list => this.AddressList = list)
            .catch(err => console.log(err));
    }

    SelectCountry(Country: any): void
    {
        this.RefreshCityList(Country.item);
    }

    OnCountryInput(event: any)
    {
        if (event.target.value)
            this.RefreshCityList(event.target.value);
    }

    RefreshCityList(Country: string): void
    {
        this.CityList = [];
        for (const key in this.JSONObject)
            if (Country.toLowerCase() === key.toLowerCase())
            {
                this.CityList = this.JSONObject[key].sort();
                break;
            }
    }

    get Selected(): Types.IUserAddress
    {
        return this._Selected;
    }

    set Selected(Address: Types.IUserAddress)
    {
        this._Selected = Address;
        this.OnSelected.emit(this._Selected);
    }

    AddressList: Array<Types.IUserAddress> = [];
    IsShowAddresses: boolean = false;
    _Selected: Types.IUserAddress;
    ModalTitle: string;
    ModalAddress: Types.IUserAddress;
    CountryList: string[] = [];
    CityList: string[] = [];
    Delivery: FormGroup;
    DeliveryControlName =
    {
        Recipient: FormControl,
        Tel: FormControl,
        Country: FormControl,
        City: FormControl,
        Street: FormControl,
        Zip: FormControl
    };
    private Http: THttpClient = new THttpClient('json', '/api');

    SearchCity: (input: Observable<string>) => Observable<string[]>;
    SearchCountry: (input: Observable<string>) => Observable<string[]>;
    JSONObject: any;
    @Input() toggleTheme: boolean = false;
    @Output() OnSelected = new EventEmitter<Types.IUserAddress>();
}


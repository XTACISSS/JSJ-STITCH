export interface IChilexpressResponse{
    statusCode:        number;
    statusDescription: string;
    errors:            null;
}
export interface IChilexpressCotizador {
    originCountyCode:      string;
    destinationCountyCode: string;
    package:               Package;
    productType:           number;
    contentType:           number;
    declaredWorth:         string;
    deliveryTime:          number;
}

export interface Package {
    weight: string;
    height: string;
    width:  string;
    length: string;
}

export interface IChilexpressCotizadorResponse extends IChilexpressResponse {
    data?: Cobertura;
}

export interface Cobertura {
    courierServiceOptions: CourierServiceOption[];
}

export interface CourierServiceOption {
    serviceTypeCode:        number;
    serviceDescription:     string;
    didUseVolumetricWeight: boolean;
    finalWeight:            string;
    serviceValue:           string;
    conditions:             string;
    deliveryType:           number;
    additionalServices:     any[];
}
export interface IChilexpressCoberturaRegionsResponse extends IChilexpressResponse {
    regions:           Region[];
}

export interface Region {
    regionId:      string;
    regionName:    string;
    ineRegionCode: number;
}



export interface IChilexpressCoberturaComunasRequest{
    RegionCode:string;
    type: 0|1|2;
}
export interface IChilexpressCoberturaComunasResponse extends IChilexpressResponse {
    coverageAreas:     CoverageArea[];
}

export interface CoverageArea {
    countyCode:    string;
    countyName:    string;
    regionCode:    string;
    ineCountyCode: number;
    queryMode:     number;
    coverageName:  string;
}


export interface IChilexpressCoberturaCalleRequest{
    countyName:               string;
    streetName:               string;
    pointsOfInterestEnabled?: boolean;
    streetNameEnabled?:       boolean;
    roadType?:                number;
}

export interface IChilexpressCoberturaCalleResponse extends IChilexpressResponse {
    streets:           Street[];
}

export interface Street {
    streetId:   number;
    streetName: string;
    countyName: string;
    roadType:   string;
}

export interface IChilexpressEnvioGenerarRequest {
    header:  Header;
    details: Detail[];
}

export interface Detail {
    addresses: Address[];
    contacts:  Contact[];
    packages:  Package[];
}

export interface Address {
    addressId:                  number;
    countyCoverageCode:         string;
    streetName:                 string;
    streetNumber:               number;
    supplement:                 string;
    addressType:                string;
    deliveryOnCommercialOffice: boolean;
    commercialOfficeId?:        string;
    observation:                string;
}

export interface Contact {
    name:        string;
    phoneNumber: string;
    mail:        string;
    contactType: string;
}

export interface Package {
    weight:                     string;
    height:                     string;
    width:                      string;
    length:                     string;
    serviceDeliveryCode?:        string;
    productCode?:                string;
    deliveryReference?:          string;
    groupReference?:             string;
    declaredValue?:              string;
    declaredContent?:            string;
    receivableAmountInDelivery?: number;
}

export interface Header {
    certificateNumber:          number;
    customerCardNumber:         string;
    countyOfOriginCoverageCode: string;
    labelType:                  number;
    marketplaceRut:             string;
    sellerRut:                  string;
}


export interface Direccion{
    region:string;
    comuna:string;
    direccion:string;
    numeracion:string;
}

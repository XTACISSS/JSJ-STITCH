export interface IPaymentResponse{
    token:string;
    url:string;
}

export interface IPaymentResult {
    vci:                 string;
    amount:              number;
    status:              string;
    buy_order:           string;
    session_id:          string;
    card_detail:         CardDetail;
    accounting_date:     string;
    transaction_date:    Date;
    authorization_code:  string;
    payment_type_code:   string;
    response_code:       number;
    installments_number: number;
}

export interface CardDetail {
    card_number: string;
}
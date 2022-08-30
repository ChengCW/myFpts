export interface IUser {
    id: string;
    email: string;
    name: string;
    claimTime?: Date;

}

export interface IDeleteUserBody {
    country: string,
    ids: Array<string>
}

export interface IQueryCountryResult {
    country: string,
}

export interface Iquery {
    countryCode: string
}

export interface IUsers {
    users: Array<IUser>

}
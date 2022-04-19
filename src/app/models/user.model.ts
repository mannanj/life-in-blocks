export interface userState {
    account: account;
    loggedIn: boolean;
    loading: boolean;
}

export interface account {
    id: string;
    firstName: string;
    lastName: string;
    dob: Date;
    email: string;
    password: string;
}
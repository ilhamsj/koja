// const host = "http://localhost:8012/api/v1";
const host =
  "https://cors-anywhere.herokuapp.com/http://elogistic.ms.demo-qs.xyz:8010/api/v1";

var MAIN_GetTransactionsType_Url = `${host}/transaction`;
var MAIN_GetDocCodeCustoms_url = `${host}/document`;
var MAIN_GetCoreor_url = `${host}/coreor`;
var MAIN_GetDocumentCustomsNGen_url = `${host}/document/custom`;
var BILLING_ConfirmTransaction_url = `${host}/transaction/confirm`;
var checkStatusContainer_url = `${host}/container`; // single/show
var storeStatusContainer_url = `${host}/container`;
var BILLING_GetBillingDetail_url = `${host}/billing/detail`;
var BILLING_GetInvoice_url = `${host}/billing/invoice`;
var BILLING_GetBilling_url = `${host}/billing/generate`;
var BILLING_GetProforma_url = `${host}/billing/proforma`;
var AUTH_GetLogOut_url = `${host}/logout`;
var AUTH_GetLogin_url = `${host}/login`;

var BILLING_GetBillingDetail = (proforma_invoice_no) => {
  fetch(BILLING_GetBillingDetail_url, {
    method: "POST",
    body: JSON.stringify({
      proforma_invoice_no: proforma_invoice_no,
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    .then((response) => response.json())
    .then((result) => {
      $.map(result, function (val, key) {
        if (typeof val != "object") {
          appendData(val, key);
        } else {
          $.map(val, function (elementOrValue, indexOrKey) {
            appendData(elementOrValue, indexOrKey);
          });
        }
      });
    });
};

var BILLING_GetInvoice = (proforma_invoice_no, url) => {
  fetch(BILLING_GetInvoice_url, {
    method: "POST",
    body: JSON.stringify({
      proforma_invoice_no: proforma_invoice_no,
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      if (result.STATUS == "TRUE") {
        alert(result.MESSAGE);
        window.open(url);
      } else {
        alert(`${result.MESSAGE}`);
      }
    });
};

var idProforma = window.location.search.substr(1);
BILLING_GetBillingDetail(idProforma);

$("#download").click(function (e) {
  e.preventDefault();
  var proforma_invoice_no = $("#proforma_invoice_no").val();
  var url = $("#url").val();

  BILLING_GetInvoice(proforma_invoice_no, url);
});

function appendData(val, key) {
  // $("table > tbody").append(
  //   `
  //     <tr>
  //       <td>${key}</td>
  //       <td>${val}</td>
  //       </tr>
  //     `
  // );
  if (key == "LINK" || key == "LINK_PRO") {
    $("table > tbody").append(
      `
        <tr>
          <td>${key}</td>
          <td><a target="_blank" href="${val}">${val}</a></td>
          </tr>
        `
    );
  } else if (
    key == "CUST_NAME" ||
    key == "NPWP" ||
    key == "TRANSACTIONS_NAME" ||
    key == "NO_DOCUMENT" ||
    key == "FOOTER" ||
    key == "TOTAL"
  ) {
    $("table > tbody").append(
      `
        <tr>
          <td>${key}</td>
          <td>${val}</td>
          </tr>
        `
    );
  }
}

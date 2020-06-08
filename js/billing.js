var BILLING_GetBilling = (transaction_id) => {
  fetch(BILLING_GetBilling_url, {
    method: "POST",
    body: JSON.stringify({
      transaction_id: transaction_id,
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    .then((response) => response.json())
    .then((result) => {
      if (result.STATUS == "FALSE") {
        alert(`Id Transaksi ${transaction_id} tidak ditemukan`);
      } else {
        $.map(result, function (val, key) {
          console.log(val);
          if (typeof val != "object") {
            $("table > body").append(`<b>${key}</b> ${val} <br/>`);
          } else {
            $.map(val, function (elementOrValue, indexOrKey) {
              if (typeof elementOrValue != "object") {
                $("table > tbody").append(
                  `
                <tr>
                  <td>${indexOrKey}</td>
                  <td>
                  ${elementOrValue}
                  ${
                    indexOrKey == "LINK" || indexOrKey == "LINK_PRO"
                      ? "<a target='_blank' href=" +
                        elementOrValue +
                        ">Download</a>"
                      : ""
                  }
                  </td>
                  </tr>
                `
                );
              } else {
                if (indexOrKey == "SUMMARY_DETAIL") {
                  for (let i = 0; i < elementOrValue.CHARGE.length; i++) {
                    console.log(elementOrValue.COMPONENT_GROUP_INVOICE_ID[i]);
                    // console.log(elementOrValue.CHARGE[i]);
                  }
                }
              }
            });
          }
        });
      }
    });
};

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
      console.log(result);
      $.map(result, function (val, key) {
        console.log(val);
        if (typeof val != "object") {
          $("body > div").append(`<b>${key}</b> ${val} <br/>`);
        } else {
          $.map(val, function (elementOrValue, indexOrKey) {
            $("body > div").append(
              `<b>${indexOrKey}</b> ${elementOrValue} <br/>`
            );
          });
        }
      });
      if (result.STATUS == "FALSE") {
      }
    });
};

var BILLING_GetProforma = (transaction_id, url) => {
  fetch(BILLING_GetProforma_url, {
    method: "POST",
    body: JSON.stringify({
      transaction_id: transaction_id,
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      alert(result.MESSAGE);
      if (result.STATUS == "TRUE") {
        window.open(url);
      }
    });
};

var idTransaksi = window.location.search.substr(1);
BILLING_GetBilling(idTransaksi);

$("button").click(function (e) {
  e.preventDefault();
  var id = $("#transaction_id").val();
  var url = $("#url").val();
  BILLING_GetProforma(id, url);
});

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
      console.log(result);
      $.map(result, function (val, key) {
        console.log(val);
        $("#url").val(result.DETAIL_BILLING.LINK);
        if (typeof val != "object") {
          $("body > div").append(`<b>${key}</b> ${val} <br/>`);
        } else {
          $.map(val, function (elementOrValue, indexOrKey) {
            $("table > tbody").append(
              `
              <tr>
                <td>${indexOrKey}</td>
                <td>${elementOrValue}</td>
                </tr>    
              `
            );
          });
        }
      });
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

$("#transaction_id").change(function (e) {
  var id = $(this).val();
  e.preventDefault();
  BILLING_GetBilling(id);
});

$("button").click(function (e) {
  e.preventDefault();
  var id = $("#transaction_id").val();
  var url = $("#url").val();
  BILLING_GetProforma(id, url);
});

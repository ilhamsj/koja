var CUST_ID_PPJK = 7407;
var groupId = 6;
var terminalId = "KOJA";
var cntrId = [];
// const host = "http://localhost:8012/api/v1";
const host =
  "https://cors-anywhere.herokuapp.com/http://elogistic.ms.demo-qs.xyz:8010/api/v1";

var MAIN_GetTransactionsType_Url = `${host}/transaction`;
var MAIN_GetDocCodeCustoms_url = `${host}/document`;
var MAIN_GetCoreor_url = `${host}/coreor`;
var MAIN_GetDocumentCustomsNGen_url = `${host}/document/custom`;
var BILLING_ConfirmTransaction_url = `${host}/transaction/confirm`;
var checkStatusContainer_url = `${host}/container`; // container/id
var storeStatusContainer_url = `${host}/container`;

$("#categoryId").change(function (e) {
  e.preventDefault();
  var categoryId = $(this).val();
  MAIN_GetTransactionsType(groupId, categoryId, terminalId);
  MAIN_GetDocCodeCustoms(groupId, categoryId);
});

$("#MAIN_GetDocumentCustomsNGen").click(function (e) {
  e.preventDefault();
  MAIN_GetDocumentCustomsNGen(CUST_ID_PPJK, terminalId);
});

$("table").on("change", "input", function () {
  var id = $(this).attr("id");
  cntrId.push(id);
  console.log(cntrId);
});

$("#confirmTransaction").click(function (e) {
  e.preventDefault();
  if (cntrId.length == 0) {
    alert("please select");
  } else {
    cntrId.map((val) => {
      checkStatusContainer(val);
    });
  }
});

var MAIN_GetTransactionsType = (groupId, categoryId, terminalId) => {
  fetch(MAIN_GetTransactionsType_Url, {
    method: "POST",
    body: JSON.stringify({
      group_id: groupId,
      category_id: categoryId,
      terminal_id: terminalId,
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    .then((response) => response.json())
    .then((json) => {
      console.log(json);
      $("#transactionType > option").remove();
      for (let i = 0; i < json.TRANSACTIONS_NAME.length; i++) {
        $("#transactionType").append(
          `<option value="${json.TRANSACTIONS_TYPE_ID[i]}">${json.TRANSACTIONS_NAME[i]}</option>`
        );
      }
    });
};

var MAIN_GetDocCodeCustoms = (groupId, categoryId) => {
  fetch(MAIN_GetDocCodeCustoms_url, {
    method: "POST",
    body: JSON.stringify({
      group_id: groupId,
      category_id: categoryId,
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    .then((response) => response.json())
    .then((json) => {
      console.log(json);
      $("#documentId > option").remove();
      for (let i = 0; i < json.CUSTOMS_DOCUMENT_NAME.length; i++) {
        $("#documentId").append(
          `<option value="${json.CUSTOMS_DOCUMENT_ID[i]}">${json.CUSTOMS_DOCUMENT_NAME[i]}</option>`
        );
      }
    });
};

var MAIN_GetCoreor = (bl_nbr, terminal_id) => {
  fetch(MAIN_GetCoreor_url, {
    method: "POST",
    body: JSON.stringify({
      document_no: bl_nbr,
      bl_nbr: bl_nbr,
      pin: "",
      terminal_id: terminal_id,
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    .then((response) => response.json())
    .then((json) => {
      $("#do_expired").val(json.DO_EXPIRED[0]);
    });
};

var MAIN_GetDocumentCustomsNGen = (CUST_ID_PPJK, terminal_id) => {
  var document_no_beacukai = $("#document_no_beacukai").val();
  var customs_document_id = $("#documentId").val();
  var transactions_type_id = $("#transactionType").val();

  fetch(MAIN_GetDocumentCustomsNGen_url, {
    method: "POST",
    body: JSON.stringify({
      npwp_depo: "",
      document_no: document_no_beacukai,
      customs_document_id: customs_document_id,
      transactions_type_id: transactions_type_id,
      document_shipping_date: "",
      document_date: "",
      document_shipping_no: "",
      cust_id_ppjk: CUST_ID_PPJK,
      terminal_id: terminal_id,
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    .then((response) => response.json())
    .then((json) => {
      console.log(json);

      if (json.STATUS == "FALSE") {
        $("table > tbody > tr").remove();
        alert(json.MESSAGE);
      } else {
        var document_no = json.NO_SPPB[0];
        var bl_nbr = json.NO_BL_AWB[0];
        $("#document_no").val(document_no);
        $("#bl_nbr").val(bl_nbr);

        MAIN_GetCoreor(bl_nbr, terminalId);

        if (json.STATUS == "FALSE") {
          alert(json.MESSAGE);
        } else {
          $("table > tbody > tr").remove();
          for (let i = 0; i < json.NO_CONT.length; i++) {
            $("table > tbody").append(`<tr>
            <td><input type="checkbox" name="" id="${json.NO_CONT[i]}" ${
              json.STATUS_PAID[i] == "VALID" ? "" : "disabled"
              // json.STATUS_PAID[i] == "VALID" ? "" : ""
            }/></td>
            <td>${json.NO_CONT[i]}</td>
            <td>${json.CNTR_SIZE[i]} / ${json.CNTR_TYPE[i]} </td>
            <td>${json.STATUS_PAID[i]} </td>
            <td>${json.LS_LOCATION_TYPE[i]} </td>
            <td>${json.STACKING_DATE[i]} </td>
          </tr>`);
          }
        }
      }
    });
};

var BILLING_ConfirmTransaction = () => {
  //
  var document_shipping_date = $("#document_shipping_date").val();
  var paid_thru = $("#paid_thru").val();
  var bl_nbr = $("#bl_nbr").val();
  var document_no = $("#document_no").val();

  fetch(BILLING_ConfirmTransaction_url, {
    method: "POST",
    body: JSON.stringify({
      certificated_id: [""],
      old_company_code: "",
      cust_id: "39161",
      iso_code: [""],
      transactions_type_id: "1",
      over_right: [""],
      document_shipping_no: bl_nbr,
      old_voyage_no: "",
      start_plug: [],
      over_left: [""],
      owner: ["KOJA"],
      pm_id: "C",
      document_shipping_date: document_shipping_date,
      voyage_no: "001",
      company_code: "KOJA",
      weight: [""],
      certificated_pic: [""],
      old_vessel_id: "",
      imo_code: [""],
      un_number: [""],
      vessel_id: "DUMMYK",
      pod: [""],
      cust_sertificated: [""],
      document_date: "20180822",
      stop_plug: [""],
      cust_id_ppjk: "",
      pol: [""],
      old_invoice_no: "",
      fd: [""],
      no_cont: cntrId,
      refeer_temperature: [""],
      voltage_plug: [""],
      tgl_nhi: "",
      old_pod: [""],
      customs_document_id: "1",
      no_bl_awb: bl_nbr,
      weight_vgm: [""],
      old_no_cont: [""],
      npwp_sertificated: [""],
      document_no: document_no,
      old_fd: [""],
      over_front: [""],
      over_back: [""],
      paid_thru: paid_thru,
      tgl_bk_segel_nhi: "",
      queue_counter_id: "",
      cust_id_req: null,
      over_height: [""],
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    .then((response) => response.json())
    .then((json) => {
      console.log(json);
      alert(`${json.TRANSACTION_ID} ${json.MESSAGE}`);
      cntrId.map((container) => {
        storeStatusContainer(container, json.TRANSACTION_ID, 0);
      });
    });
};

var showError = (status, message) => {
  if (status == "FALSE") {
    alert(message);
    return false;
  } else {
    return true;
  }
};

var checkStatusContainer = (container) => {
  fetch(`${checkStatusContainer_url}/${container}`, {
    method: "GET",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    .then((response) => response.json())
    .then((json) => {
      console.log(json);
      if (json.success == false) {
        BILLING_ConfirmTransaction();
        console.log("buat transaksi");
      } else {
        var status = confirm(
          `Kontainer ${json.container} dengan ID transaksi ${json.invoice} dalam proses pembayaran, apakah anda ingin membuat transaksi baru ?`
        );
        if (status) {
          BILLING_ConfirmTransaction();
        } else {
          location.reload();
        }
      }
    });
};

var storeStatusContainer = (container, invoice, proforma) => {
  fetch(storeStatusContainer_url, {
    method: "POST",
    body: JSON.stringify({
      container: container,
      invoice: invoice,
      proforma: proforma,
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    .then((response) => response.json())
    .then((json) => {
      console.log(json);
    });
};

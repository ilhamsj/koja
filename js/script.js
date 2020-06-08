var CUST_ID_PPJK = null; // from response login
var groupId = 6;
var terminalId = "KOJA";

// from response customngen
var cntrId = [];
var CUST_ID = [];
var containerOwner = [];
var voyageNo = [];
var vesselId = [];
var lineId = []; // company code

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
  var data = $(this).attr("id");
  var custId = $(this).attr("data-custId");
  var dataContainerOwner = $(this).attr("data-containerOwner");
  var dataVoyageNo = $(this).attr("data-voyageNo");
  var dataVesselId = $(this).attr("data-vesselId");
  var dataLineId = $(this).attr("data-lineId");

  if (this.checked) {
    cntrId.push(data);
    CUST_ID.push(custId);
    containerOwner.push(dataContainerOwner);
    voyageNo.push(dataVoyageNo);
    vesselId.push(dataVesselId);
    lineId.push(dataLineId);
  } else {
    const index = cntrId.indexOf(data);
    if (index > -1) {
      cntrId.splice(index, 1);
      CUST_ID.splice(index, 1);
      containerOwner.splice(index, 1);
      voyageNo.splice(index, 1);
      vesselId.splice(index, 1);
      lineId.splice(index, 1);
    }
  }
  console.log(cntrId);
  console.log(CUST_ID);
  console.log(containerOwner);
  console.log(voyageNo);
  console.log(vesselId);
  console.log(lineId);
});

$("#confirmTransaction").click(function (e) {
  e.preventDefault();
  var categoryId = $("#categoryId").val();
  if (cntrId.length == 0) {
    alert("please select container");
  } else if (categoryId == "I") {
    var paid_thru = $("#paid_thru").val();
    console.log(paid_thru);
    if (paid_thru.trim().length == 0) {
      alert("paid_thru tidak boleh kosong");
    } else {
      cntrId.map((val) => {
        checkStatusContainer(val);
      });
    }
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
      $("#transactionType > option").not(":first").remove();
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
      $("#documentId > option").not(":first").remove();
      for (let i = 0; i < json.CUSTOMS_DOCUMENT_NAME.length; i++) {
        $("#documentId").append(
          `<option value="${json.CUSTOMS_DOCUMENT_ID[i]}" data-document="${json.CUSTOMS_DOCUMENT_NAME[i]}">${json.CUSTOMS_DOCUMENT_NAME[i]}</option>`
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

  $("#MAIN_GetDocumentCustomsNGen > .spinner-border").removeClass("collapse");

  fetch(MAIN_GetDocumentCustomsNGen_url, {
    method: "POST",
    body: JSON.stringify({
      cust_id_ppjk: CUST_ID_PPJK,
      customs_document_id: customs_document_id,
      document_date: "",
      document_no: document_no_beacukai,
      document_shipping_date: "",
      document_shipping_no: "",
      npwp_depo: "",
      terminal_id: terminal_id,
      transactions_type_id: transactions_type_id,
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    .then((response) => response.json())
    .then((json) => {
      console.log(json);
      $("#MAIN_GetDocumentCustomsNGen > .spinner-border").addClass("collapse");

      if (json.STATUS == "FALSE") {
        $("table > tbody > tr").remove();
        alert(json.MESSAGE);
      } else {
        $("#select_container").removeClass("collapse");
        $(".card:first > .card-body").addClass("collapse");

        var document_no = json.NO_BL_AWB[0];
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
            <td><input type="checkbox" name="" 
            data-lineId="${json.LINE_ID[i]}" 
            data-voyageNo="${json.VOYAGE_NO[i]}" 
            data-vesselId="${json.VESSEL_ID[i]}" 
            data-containerOwner="${json.OWNER[i]}" 
            data-custId="${json.CUST_ID[i]}" 
            id="${json.NO_CONT[i]}" ${
              json.STATUS_PAID[i] == "VALID" ? "" : "disabled"
            }/>
            </td>
            <td>${json.NO_MASTER_BL_AWB[i]} </td>
            <td>${json.STATUS_CONT_SPPB[i]} </td>
            <td>${json.SENDER[i]} </td>
            <td>${json.VESSEL_ID[i]} </td>
            <td>${json.VOYAGE_NO[i]} </td>
            <td>${json.VESSEL_NAME[i]} </td>
            <td>${json.ETA[i]} </td>
            <td>${json.ATA[i]} </td>
            <td>${json.ETD[i]} </td>
            <td>${json.LINE_ID[i]} </td>
            <td>${json.NO_CONT[i]} </td>
            <td>${json.CNTR_SIZE[i]} </td>
            <td>${json.CNTR_TYPE[i]} </td>
            <td>${json.LS_LOCATION_TYPE[i]} </td>
            <td>${json.STACKING_DATE[i]} </td>
            <td>${json.OWNER[i]} </td>
            <td>${json.REEFER_IN_REFIGERATION_INDR[i]} </td>
            <td>${json.REQUIRED_RFR_TEMPERATURE[i]} </td>
            <td>${json.REQUIRED_RFR_VOLTAGE[i]} </td>
            <td>${json.STATUS_KARANTINA[i]} </td>
            <td>${json.STATUS_PAID[i]} </td>
          </tr>`);
          }
        }
      }
    });
};

var BILLING_ConfirmTransaction = () => {
  //
  var document_shipping_date = $("#document_shipping_date").val();
  var document_date = $("#document_date").val();
  var paid_thru = $("#paid_thru").val();

  var bl_nbr = $("#bl_nbr").val();
  var document_no = $("#document_no").val();
  var transactions_type_id = $("#transactionType").val();
  var customs_document_id = $("#documentId").val();

  fetch(BILLING_ConfirmTransaction_url, {
    method: "POST",
    body: JSON.stringify({
      certificated_id: [""],
      certificated_pic: [""],
      company_code: lineId[0],
      cust_id: CUST_ID[0], // request koja string bukan array
      cust_id_ppjk: "",
      cust_id_req: null,
      cust_sertificated: [""],
      customs_document_id: customs_document_id,
      document_date: document_date,
      document_no: document_no,
      document_shipping_date: document_shipping_date,
      document_shipping_no: bl_nbr,
      fd: [""],
      imo_code: [""],
      iso_code: [""],
      no_bl_awb: bl_nbr,
      no_cont: cntrId,
      npwp_sertificated: [""],
      old_company_code: "",
      old_fd: [""],
      old_invoice_no: "",
      old_no_cont: [""],
      old_pod: [""],
      old_vessel_id: "",
      old_voyage_no: "",
      over_back: [""],
      over_front: [""],
      over_height: [""],
      over_left: [""],
      over_right: [""],
      owner: containerOwner,
      paid_thru: paid_thru,
      pm_id: "A", // koja internal
      pod: [""],
      pol: [""],
      queue_counter_id: "",
      refeer_temperature: [""],
      start_plug: [],
      stop_plug: [""],
      tgl_bk_segel_nhi: "",
      tgl_nhi: "",
      transactions_type_id: transactions_type_id,
      un_number: [""],
      vessel_id: vesselId[0],
      voltage_plug: [""],
      voyage_no: voyageNo[0],
      weight: [""],
      weight_vgm: [""],
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
      window.open(
        `${window.location.origin}/billing.html?${json.TRANSACTION_ID}`
      );
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

$("#documentId").change(function (e) {
  e.preventDefault();
  var docId = $("option:selected", this).text();
  $("#document_no_beacukai").attr("placeholder", `No ${docId}`);
  $(".label_document").text(`${docId}`);
});

$(".card:first > .card-header").click(function (e) {
  e.preventDefault();
  $(this).next().removeClass("collapse");
  $("#select_container").addClass("collapse");
});

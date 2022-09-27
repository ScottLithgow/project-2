//Data Arrays to be filled onload

let db = [];
const location_array = [];
let filtered_db;

// Onload function to populate initial page state/ fill data arrays 

$(document).ready(function () {
  $("#preloader").css("z-index", "0");
  const getAll = () => {
    $.ajax({
    url: "./server/getAll.php",
    type: "GET",
    dataType: "json",
    data: {
      url: "./getGeoJson.php",
    },

    success: function (result) {
      db = [];
      db.push(result.data);
      filtered_db = db[0];

      $(".tbody").html("");

      $.each(result.data, function (i, item) {
        // populate employee info table rows
        $(".country-form-select").append(
          $(".tbody").append(
            `
              <tr>
                <th scope="row"></th>
                <td class = '${item["id"]}_fName '>${item["firstName"]}</td>
                <td class = '${item["id"]}_lName'>${item["lastName"]}</td>
                <td>${item["department"]}</td>
                <td>${item["location"]}</td>
                <td class = '${item["id"]}_email'>${item["email"]}</td>
                <td><button type="button" class="btn btn-primary edit_employee ${item["id"]}" >Edit</button></td>
                <td><button type="button" class="btn btn-dark delete_employee" id = ${item["id"]} ></i></button></td>
              </tr>
          `
          )
        );
      });
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(errorThrown);
      console.log(textStatus);
      console.log(jqXHR);
    },
  });}

  getAll()

  $.ajax({
    url: "./server/location/getAllLocations.php",
    type: "GET",
    dataType: "json",
    data: {},

    success: function (result) {
      //populates location array for use in deparment / location edit modals
      location_array.push(result.data);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(errorThrown);
      console.log(textStatus);
      console.log(jqXHR);
    },
  });

  const get_all_departments_personnel = (modal) => {
    $.ajax({
      url: "./server/department/getAllDepartments.php",
      type: "GET",
      dataType: "json",

      success: function (result) {
        $(modal).html("");

        $.each(result.data, function (i, select) {
          $(modal).append(
            $("<option>", {
              value: select.id,
              text: select.name,
            })
          );
        });
      },

      error: function (jqXHR, textStatus, errorThrown) {
        console.log(errorThrown);
        console.log(textStatus);
        console.log(jqXHR);
      },
    });
  };

  let edit_target_p_firstName;
  let edit_target_p_lastName;
  let edit_target_p_email;
  let edit_target_p_departmentID;
  let personnelID;

  $(".tbody").on("click", ".edit_employee", (e) => {
    personnelID = e.target.classList[3]

    $(`.edit_personnel_fName`).val($(`.${personnelID}_fName`).html());
    $(`.edit_personnel_lName`).val($(`.${personnelID}_lName`).html());
    $(`.edit_personnel_email`).val($(`.${personnelID}_email`).html());

    get_all_departments_personnel(`.edit_personnel_department`);

    $(".edit_personnel_modal").modal("toggle");
  });

  $(".edit_personnel").on("click", (e) => {

    edit_target_p_firstName = $(`.edit_personnel_fName`).val();
    edit_target_p_lastName = $(`.edit_personnel_lName`).val();
    edit_target_p_email = $(`.edit_personnel_email`).val();
    edit_target_p_departmentID = $(`.edit_personnel_department`).val();

    $(".confirm_employee_edit_modal").modal("toggle");
    $(".edit_personnel_modal").modal("toggle");
  });

  $(".final_edit_employee_confirm").on("click", (e) => {
    $.ajax({
      url: "./server/personnel/updatePersonnelByID.php",
      type: "POST",
      dataType: "json",
      data: {
        first_name: edit_target_p_firstName,
        last_name: edit_target_p_lastName,
        email: edit_target_p_email,
        departmentID: edit_target_p_departmentID,
        id: personnelID,
      },

      success: function (result) {
        $(".confirm_employee_edit_modal").modal("toggle");
        getAll()
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(errorThrown);
        console.log(textStatus);
        console.log(jqXHR);
      },
    });
  });

  // // insert department modal population

  $(".insert_employee").click(() => {
    get_all_departments_personnel(`.insert_personnel_department`);
    $(".insert_personnel_modal").modal("toggle");
  });

  // // insert deparment submit hadling

  $(".add_personnel").on("click", (e) => {
    $(".insert_personnel_modal").modal("toggle");
    $(".confirm_insert_personnel_modal").modal("toggle");
  });

  $(".final_insert_personnel_confirm").on("click", (e) => {
    $.ajax({
      url: "./server/personnel/insertPersonnel.php",
      type: "POST",
      dataType: "json",
      data: {
        first_name: $(".insert_p_first_name").val(),
        last_name: $(".insert_p_last_name").val(),
        email: $(".insert_p_email").val(),
        departmentID: $(".insert_personnel_department").val(),
      },

      success: function (result) {
        $(".confirm_insert_personnel_modal").modal("toggle");
        getAll();
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(errorThrown);
        console.log(textStatus);
        console.log(jqXHR);
      },
    });
  });

  // // delete department submit handling

  let p_delete_target;

  
  $(".tbody").on("click", ".delete_employee", (e) => {
    $(".delete_personnel_modal").modal("toggle");
    p_delete_target = e.target.id;
  });

  $(".final_delete_personnel_confirm").on("click", (e) => {
    $.ajax({
      url: "./server/personnel/deletePersonnelByID.php",
      type: "POST",
      data: {
        personnel_ID: p_delete_target,
      },

      success: function (result) {
        $(".delete_personnel_modal").modal("toggle");
        getAll();
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(errorThrown);
        console.log(textStatus);
        console.log(jqXHR);
      },
    });
  });

  // function used to populate table after sorting algorithms

  const table_fill = () => {
    filtered_db.forEach((item) => {
      $(".tbody").append(
        `
              <tr>
                <th scope="row"></th>
                <td class = '${item["id"]}_fName '>${item["firstName"]}</td>
                <td class = '${item["id"]}_lName'>${item["lastName"]}</td>
                <td>${item["department"]}</td>
                <td>${item["location"]}</td>
                <td class = '${item["id"]}_email'>${item["email"]}</td>
                <td><button type="button" class="btn btn-primary edit_employee ${item["id"]}" >Edit</button></td>
                <td><button type="button" class="btn btn-dark delete_employee" id = ${item["id"]} >Delete</button></td>
              </tr>
        `
      );
    });
  };

  // onClick sort function

  $(".althapbetical_sort").click(() => {
    filtered_db.sort((a, b) => a.firstName.localeCompare(b.firstName));
    $(".tbody").html("");
    table_fill();
  });

  $(".reverse_sort").click(() => {
    filtered_db.sort((a, b) => -1 * a.firstName.localeCompare(b.firstName));
    $(".tbody").html("");
    table_fill();
  });

  $(".department_sort").click(() => {
    filtered_db.sort((a, b) => a.department.localeCompare(b.department));
    $(".tbody").html("");
    table_fill();
  });

  $(".location_sort").click(() => {
    filtered_db.sort((a, b) => a.location.localeCompare(b.location));
    $(".tbody").html("");
    table_fill();
  });

  $(".last_name_sort").click(() => {
    filtered_db.sort((a, b) => a.lastName.localeCompare(b.lastName));
    $(".tbody").html("");
    table_fill();
  });

  $(".email_sort").click(() => {
    filtered_db.sort((a, b) => a.email.localeCompare(b.email));
    $(".tbody").html("");
    table_fill();
  });

  //modal onClick toggle handlers

  // search filter function
  $(".search").on("input", (e) => {
    filtered_db = db[0].filter((o) =>
      Object.keys(o).some((k) =>
        o[k].toLowerCase().includes(e.target.value.toLowerCase())
      )
    );
    $(".tbody").html("");
    filtered_db.forEach((item) => {
      $(".tbody").append(
        `
              <tr>
                <th scope="row"></th>
                <td class = '${item["id"]}_fName '>${item["firstName"]}</td>
                <td class = '${item["id"]}_lName'>${item["lastName"]}</td>
                <td>${item["department"]}</td>
                <td>${item["location"]}</td>
                <td class = '${item["id"]}_email'>${item["email"]}</td>
                <td><button type="button" class="btn btn-primary edit_employee ${item["id"]}" >Edit</button></td>
                <td><button type="button" class="btn btn-dark delete_employee" id = ${item["id"]} >Delete</button></td>
              </tr>
        `
      );
    });
  });

  //////
  ////// Department functions
  //////

  // edit deparment modal population
  const get_all_departments = () => {
    $.ajax({
      url: "./server/department/getAllDepartments.php",
      type: "GET",
      dataType: "json",

      success: function (result) {
        $(".department_modal-input_group").html("");
        $.each(result.data, function (i, item) {
          $(".department_modal-input_group").append(
            ` <div class="input-group">
                <input type="text" value="${item.name}" aria-label="department name" class="form-control ${item.id}_button_department_name" id=${item.id}>
                <select class="form-select ${item.id}_button_location_ID">
                
                </select>
                <button type="button" class="btn btn-primary edit_department btn-sm ${item.id}_button" >U</button>
                  <option></option>
                <button type="button" class="btn btn-dark btn-sm delete_department ${item.id}_button">D</button>
              </div>`
          );
        });

        $.each(result.data, function (i, select) {
          console.log(select)
          $.ajax({
          url: "./server/location/getlocationByID.php",
          type: "GET",
          dataType: "json",
          data: {
            id: select.locationID
          },

          success: function (result) {
            $(`.${select.id}_button_location_ID`).append(
              $("<option>", {
                value: select.locationID,
                text: result.data[0].name,
              })
            );
            $.each(location_array[0], function (e, location) {
              $(`.${select.id}_button_location_ID`).append(
                $("<option>", {
                  value: location.locationID,
                  text: location.location,
                })
              );
            });
          },

          error: function (jqXHR, textStatus, errorThrown) {
            console.log(errorThrown);
            console.log(textStatus);
            console.log(jqXHR);
          },
        });
          
          
        });
      },

      error: function (jqXHR, textStatus, errorThrown) {
        console.log(errorThrown);
        console.log(textStatus);
        console.log(jqXHR);
      },
    });
  };

  $(".get_department").click(() => {
    get_all_departments();
    $(".deparment_modal").modal("toggle");
  });

  // edit deparment submit handling

  let edit_target_department_name;
  let edit_target_location_ID;
  let edit_target_departmentID;

  $(".department_modal-input_group").on("click", ".edit_department", (e) => {
    target = e.target.classList[4];

    edit_target_department_name = $(`.${target}_department_name`).val();
    edit_target_location_ID = $(`.${target}_location_ID`).val();
    edit_target_departmentID = $(`.${target}_department_name`).attr("id");

    $(".confirm_edit_modal").modal("toggle");
    $(".deparment_modal").modal("toggle");
  });

  $(".final_edit_department_confirm").on("click", (e) => {
    $.ajax({
      url: "./server/department/updateDepartmentByID.php",
      type: "POST",
      dataType: "json",
      data: {
        department: edit_target_department_name,
        location_ID: edit_target_location_ID,
        department_ID: edit_target_departmentID,
      },

      success: function (result) {
        get_all_departments();
        getAll();
        $(".confirm_edit_modal").modal("toggle");
        $(".deparment_modal").modal("toggle");
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(errorThrown);
        console.log(textStatus);
        console.log(jqXHR);
      },
    });
  });

  // insert department modal population

  $(".add_department").click(() => {
    $(".department_modal-input_group").append(
      ` <div class="input-group">
                <input type="text" value="" aria-label="department name" class="form-control insert_department_name">
                <select class="form-select insert_button_location_ID">
                
                </select>
                <button type="button" class="btn btn-success btn-sm insert_department_button" >A</button>
                <button type="button" class="btn btn-dark  btn-sm">D</button>
              </div>`
    );

    $.each(location_array[0], function (e, location) {
      $(`.insert_button_location_ID`).append(
        $("<option>", {
          value: location.locationID,
          text: location.location,
        })
      );
    });
  });

  // insert deparment submit hadling

  $(".department_modal-input_group").on(
    "click",
    ".insert_department_button",
    (e) => {
      $(".confirm_insert_modal").modal("toggle");
      $(".deparment_modal").modal("toggle");
    }
  );

  $(".final_insert_department_confirm").on("click", (e) => {
    $.ajax({
      url: "./server/department/insertDepartment.php",
      type: "GET",
      dataType: "json",
      data: {
        name: $(".insert_department_name").val(),
        locationID: $(".insert_button_location_ID").val(),
      },

      success: function (result) {
        get_all_departments();
        $(".confirm_insert_modal").modal("toggle");
        $(".deparment_modal").modal("toggle");
        getAll();
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(errorThrown);
        console.log(textStatus);
        console.log(jqXHR);
      },
    });
  });

  // delete department submit handling

  let delete_target;

  $(".department_modal-input_group").on("click", ".delete_department", (e) => {
    const target = e.target.classList[4];
    delete_target = $(`.${target}_department_name`).attr("id");
    $(".confirm_delete_modal").modal("toggle");
    $(".deparment_modal").modal("toggle");
  });

  $(".final_delete_department_confirm").on("click", (e) => {
    $.ajax({
      url: "./server/department/deleteDepartmentByID.php",
      type: "POST",
      data: {
        department_ID: delete_target,
      },

      success: function (result) {
        $(".confirm_delete_modal").modal("toggle");
        $(".deparment_modal").modal("toggle");
        get_all_departments();
        getAll();
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(errorThrown);
        console.log(textStatus);
        console.log(jqXHR);
      },
    });
  });

  //////
  ////// Location functions
  //////

  // edit location modal population
  const get_all_locations = () => {
    $.ajax({
      url: "./server/location/getAllLocations.php",
      type: "GET",
      dataType: "json",
      data: {},

      success: function (result) {
        console.log(result);
        $(".location_modal-input_group").html("");
        $.each(result.data, function (i, item) {
          console.log(item);
          $(".location_modal-input_group").append(
            ` <div class="input-group">
                <input type="text" value="${item.location}" aria-label="location name" class="form-control ${item.locationID}_button_location_name" id=${item.locationID}>
                
                <button type="button" class="btn btn-primary edit_location btn-sm ${item.locationID}_button" >U</button>
                <button type="button" class="btn btn-dark btn-sm delete_location ${item.locationID}_button">D</button>
              </div>`
          );
        });
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(errorThrown);
        console.log(textStatus);
        console.log(jqXHR);
      },
    });
  };

  $(".get_location").click(() => {
    get_all_locations();
    $(".location_modal").modal("toggle");
  });

  // // edit location submit handling

  let edit_target_location_name;
  let edit_target_locationID;

  $(".location_modal-input_group").on("click", ".edit_location", (e) => {
    target = e.target.classList[4];

    console.log(target);

    edit_target_location_name = $(`.${target}_location_name`).val();
    edit_target_locationID = $(`.${target}_location_name`).attr("id");

    $(".confirm_edit_location_modal").modal("toggle");
    $(".location_modal").modal("toggle");
  });

  $(".final_edit_location_confirm").on("click", (e) => {
    $.ajax({
      url: "./server/location/updateLocationByID.php",
      type: "POST",
      dataType: "json",
      data: {
        location: edit_target_location_name,
        locationID: edit_target_locationID,
      },

      success: function (result) {
        $(".confirm_edit_location_modal").modal("toggle");
        $(".location_modal").modal("toggle");
        getAll();
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(errorThrown);
        console.log(textStatus);
        console.log(jqXHR);
      },
    });
  });

  // // insert location modal population

  $(".add_department").click(() => {
    $(".location_modal-input_group").append(
      `<div class="input-group">
          <input type="text" value="" aria-label="location name" class="form-control insert_location_name">
          
          <button type="button" class="btn btn-success btn-sm insert_location_button" >A</button>
          <button type="button" class="btn btn-dark btn-sm cancel_location">D</button>
        </div>`
    );
  });

  // // insert location submit hadling

  $(".location_modal-input_group").on(
    "click",
    ".insert_location_button",
    (e) => {
      $(".confirm_insert_location_modal").modal("toggle");
      $(".location_modal").modal("toggle");
    }
  );

  $(".final_insert_location_confirm").on("click", (e) => {
    $.ajax({
      url: "./server/location/insertLocation.php",
      type: "GET",
      dataType: "json",
      data: {
        name: $(".insert_location_name").val(),
      },

      success: function (result) {
        get_all_locations();
        $(".confirm_insert_location_modal").modal("toggle");
        $(".location_modal").modal("toggle");
        getAll();
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(errorThrown);
        console.log(textStatus);
        console.log(jqXHR);
      },
    });
  });

  // // delete location submit handling

  let delete_location_target;

  $(".location_modal-input_group").on("click", ".delete_location", (e) => {
    const target = e.target.classList[4];
    delete_location_target = $(`.${target}_location_name`).attr("id");
    console.log(delete_location_target);
    $(".confirm_delete_location_modal").modal("toggle");
    $(".location_modal").modal("toggle");
  });

  $(".final_delete_location_confirm").on("click", (e) => {
    $.ajax({
      url: "./server/location/deleteLocationByID.php",
      type: "POST",
      data: {
        location_ID: delete_location_target,
      },

      success: function (result) {
        get_all_locations();
        get_all_departments();
        getAll();
        $(".confirm_delete_location_modal").modal("toggle");
        $(".location_modal").modal("toggle");
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(errorThrown);
        console.log(textStatus);
        console.log(jqXHR);
      },
    });
  });
});


  
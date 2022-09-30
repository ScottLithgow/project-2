// Onload function to populate initial page state/ fill data arrays

$(document).ready(function () {
  $("#preloader").css("display", "none");
  const getAll = () => {
    $.ajax({
      url: "./server/getAll.php",
      type: "GET",
      dataType: "json",
      data: {
        url: "./getGeoJson.php",
      },

      success: function (result) {
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
                <td class = '${item["id"]}_dName hide'>${item["department"]}</td>
                <td class = 'hide'>${item["location"]}</td>
                <td class = '${item["id"]}_email hide'>${item["email"]}</td>
                <td><button type="button" class="btn btn-primary edit_employee ${item["id"]} ${item["departmentID"]}" >Edit</button></td>
                <td><button type="button" class="btn btn-dark delete_employee ${item["id"]} ">Delete</button></td>
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
    });
  };

  getAll();

  const get_all_departments_personnel = (modal, id) => {
    $.ajax({
      url: "./server/department/getAllDepartments.php",
      type: "GET",
      dataType: "json",

      success: function (result) {
        $(modal).html("");

        $(modal).append(
          $("<option>", {
            value: personnel_departmentID,
            text: $(`.${personnelID}_dName`).html(),
          })
        );

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
  let personnel_departmentID;

  $(".tbody").on("click", ".edit_employee", (e) => {
    personnelID = e.target.classList[3];
    personnel_departmentID = e.target.classList[4];
    $(`.edit_personnel_fName`).val($(`.${personnelID}_fName`).html());
    $(`.edit_personnel_lName`).val($(`.${personnelID}_lName`).html());
    $(`.edit_personnel_email`).val($(`.${personnelID}_email`).html());

    get_all_departments_personnel(`.edit_personnel_department`, personnelID);

    $(".edit_personnel_modal").modal("toggle");
  });

  $(".edit_personnel").on("click", (e) => {
    edit_target_p_firstName = $(`.edit_personnel_fName`).val();
    edit_target_p_lastName = $(`.edit_personnel_lName`).val();
    edit_target_p_email = $(`.edit_personnel_email`).val();
    edit_target_p_departmentID = $(`.edit_personnel_department`).val();

    $(".confirm_employee_edit_modal").modal("toggle");
    $(".edit_personnel_modal").modal("toggle");
    console.log($(`.edit_personnel_department`).val());
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
        getAll();
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(errorThrown);
        console.log(textStatus);
        console.log(jqXHR);
      },
    });
  });

  // // insert personnel modal population

  $(".insert_employee").click(() => {
    get_all_departments_personnel(`.insert_personnel_department`);
    $(".insert_personnel_modal").modal("toggle");
  });

  // // insert personnel submit hadling

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

  // // delete personnel submit handling

  let p_delete_target;

  $(".tbody").on("click", ".delete_employee", (e) => {
    p_delete_target = e.target.classList[3];
    $(".delete_personnel_modal").modal("toggle");
  });

  $(".final_delete_personnel_confirm").on("click", (e) => {
    $.ajax({
      url: "./server/personnel/deletePersonnelByID.php",
      type: "POST",
      data: {
        personnel_ID: p_delete_target,
      },

      success: function (result) {
        getAll();
        $(".delete_personnel_modal").modal("toggle");
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(errorThrown);
        console.log(textStatus);
        console.log(jqXHR);
      },
    });
  });

  // function used to populate table after sorting algorithms
  // onClick sort function
  let filter = "firstName";
  let filter_direction = "ASC";

  const filter_search = () => {
    $.ajax({
      url: "./server/getFiltered.php",
      type: "POST",
      data: {
        filter,
        filter_direction,
        search: `%${$(".search").val()}%`,
      },

      success: function (result) {
        $(".tbody").html("");
        $.each(result.data, function (i, item) {
          $(".tbody").append(
            `
              <tr>
                <th scope="row"></th>
                <td class = '${item["personnelID"]}_fName '>${item["firstName"]}</td>
                <td class = '${item["personnelID"]}_lName'>${item["lastName"]}</td>
                <td>${item["department"]}</td>
                <td>${item["location"]}</td>
                <td class = '${item["personnelID"]}_email'>${item["email"]}</td>
                <td><button type="button" class="btn btn-primary edit_employee ${item["personnelID"]}" >Edit</button></td>
                <td><button type="button" class="btn btn-dark delete_employee ${item["personnelID"]} ">Delete</button></td>
              </tr>
          `
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

  $(".althapbetical_sort").click(() => {
    filter_direction = "ASC";
    filter_search();
  });

  $(".reverse_sort").click(() => {
    filter_direction = "DESC";
    filter_search();
  });

  $(".department_sort").click(() => {
    filter = "department";
    filter_search();
  });

  $(".location_sort").click(() => {
    filter = "location";
    filter_search();
  });

  $(".first_name_sort").click(() => {
    filter = "firstName";
    filter_search();
  });

  $(".last_name_sort").click(() => {
    filter = "lastName";
    filter_search();
  });

  $(".email_sort").click(() => {
    filter = "email";
    filter_search();
  });

  //modal onClick toggle handlers

  // search filter function
  $(".search").on("input", (e) => {
    filter_search();
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
                <button type="button" class="btn btn-dark btn-sm delete_department ${item.id}_button">D</button>
              </div>`
          );
        });

        $.each(result.data, function (i, select) {
          $.ajax({
            url: "./server/location/getLocationByID.php",
            type: "POST",
            dataType: "json",
            data: {
              id: select.locationID,
            },

            success: function (result) {
              $(`.${select.id}_button_location_ID`).append(
                $("<option>", {
                  value: select.locationID,
                  text: result.data[0].name,
                })
              );

              $.ajax({
                url: "./server/location/getAllLocations.php",
                type: "POST",
                dataType: "json",

                success: function (result) {
                  $.each(result.data, function (e, location) {
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
      ` <div class="input-group insert_department_text">
                <input type="text" value="" aria-label="department name" class="form-control insert_department_name">
                <select class="form-select insert_button_location_ID">
                
                </select>
                <button type="button" class="btn btn-success btn-sm insert_department_button" >A</button>
                <button type="button" class="btn btn-dark remove_add_department btn-sm">D</button>
              </div>`
    );

    $.ajax({
      url: "./server/location/getAllLocations.php",
      type: "POST",
      dataType: "json",

      success: function (result) {
        $.each(result.data, function (e, location) {
          $(`.insert_button_location_ID`).append(
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
      type: "POST",
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
        if (result.status.code === "400") {
          get_all_departments();
          $(".delete_error").modal("toggle");
        } else {
          get_all_departments();
          getAll();
          $(".confirm_delete_modal").modal("toggle");
          $(".deparment_modal").modal("toggle");
        }
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
        $(".location_modal-input_group").html("");
        $.each(result.data, function (i, item) {
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
      type: "POST",
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
        if (result.status.code === "400") {
          get_all_locations();
          $(".delete_error").modal("toggle");
        } else {
          get_all_locations();
          get_all_departments();
          getAll();
          $(".confirm_delete_location_modal").modal("toggle");
          $(".location_modal").modal("toggle");
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(errorThrown);
        console.log(textStatus);
        console.log(jqXHR);
      },
    });
  });
});

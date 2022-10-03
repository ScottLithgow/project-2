// Onload function to populate initial page state/ fill data arrays

$(document).ready(function () {
  $("#preloader").css("display", "none");
  const edit = '<i class="fa-solid fa-pen-to-square"></i>';
  const bin = '<i class="fa-solid fa-trash"></i>';
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
                <td>${item["lastName"]} ${item["firstName"]}</td>
                <td class = 'hide'>${item["department"]}</td>
                <td class = 'hide'>${item["location"]}</td>
                <td class = 'hide'>${item["email"]}</td>
                <td>
                  <button type="button" class="btn btn-outline-secondary edit_employee ${item["id"]}" data-bs-toggle="modal" data-bs-target=".edit_personnel_modal" >
                    ${edit}
                  </button>
                </td>
                <td>
                  <button type="button" class="btn btn-outline-secondary delete_employee ${item["id"]}" data-bs-toggle="modal" data-bs-target=".delete_personnel_modal">
                    ${bin}
                  </button>
                </td>
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

  const get_personnel_department = (id) => {
    $.ajax({
      url: "./server/personnel/getPersonnelByID.php",
      type: "POST",
      dataType: "json",
      data: {
        id: id,
      },

      success: function (result) {
        $(".edit_personnel_fName").val(result.data[0].firstName);
        $(".edit_personnel_lName").val(result.data[0].lastName);
        $(".edit_personnel_email").val(result.data[0].email);
        $(".edit_personnel_department").html(
          $("<option>", {
            value: result.data[0].departmentID,
            text: result.data[0].department,
          })
        );
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(errorThrown);
        console.log(textStatus);
        console.log(jqXHR);
      },
    });
  };

  get_all_departments_personnel = (modal) => {
    $.ajax({
      url: "./server/department/getAllDepartments.php",
      type: "POST",
      dataType: "json",

      success: function (result) {
        const first_option = $(modal).first().val();
        $.each(result.data, function (i, item) {
          if (item.id !== first_option) {
            $(modal).append(
              $("<option>", {
                value: item.id,
                text: item.name,
              })
            );
          }
        });
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(errorThrown);
        console.log(textStatus);
        console.log(jqXHR);
      },
    });
  };

  let personnelID;

  $("#confirm_employee_submit").on("show.bs.modal", (e) => {
    $(".edit_e_fname").text($(".edit_personnel_fName").val());
    $(".edit_e_lname").text($(".edit_personnel_lName").val());
    $(".edit_e_email").text($(".edit_personnel_email").val());
  });

  $(".edit_personnel_modal").on("show.bs.modal", (e) => {
    personnelID = e.relatedTarget.classList[3];
    get_personnel_department(personnelID);
    get_all_departments_personnel(".edit_personnel_department");
  });

  $("#submit_edit_personnel").click(function () {
    $(".edit_personnel_form").submit();
  });

  $(".edit_personnel_form").on("submit", (e) => {
    e.preventDefault();
    $.ajax({
      url: "./server/personnel/updatePersonnelByID.php",
      type: "POST",
      dataType: "json",
      data: {
        first_name: $(".edit_personnel_fName").val(),
        last_name: $(".edit_personnel_lName").val(),
        email: $(".edit_personnel_email").val(),
        departmentID: $(".edit_personnel_department").val(),
        id: personnelID,
      },

      success: function (result) {
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

  $(".insert_personnel_modal").on("show.bs.modal", () => {
    get_all_departments_personnel(`.insert_personnel_department`);
  });

  // // insert personnel submit hadling
  $("#confirm_insert_personnel_modal").on("show.bs.modal", () => {
    $(".insert_e_lname").text($(".insert_p_first_name").val());
    $(".insert_e_fname").text($(".insert_p_last_name").val());
    $(".insert_e_email").text($(".insert_p_email").val());
  });

  $("#submit_insert_personnel").click(function () {
    $(".insert_personnel_form").submit();
  });

  $(".insert_personnel_form").on("submit", (e) => {
    e.preventDefault();
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

  $(".delete_personnel_modal").on("show.bs.modal", (e) => {
    p_delete_target = e.relatedTarget.classList[3];
    $.ajax({
      url: "./server/personnel/getPersonnelByID.php",
      type: "POST",
      data: {
        id: p_delete_target,
      },

      success: function (result) {
        const target = result.data[0];
        $(".delete_e_lname").text(target.lastName);
        $(".delete_e_fname").text(target.firstName);
        $(".delete_e_email").text(target.email);
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(errorThrown);
        console.log(textStatus);
        console.log(jqXHR);
      },
    });
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
                <td class = '${item["personnelID"]}_name '>${item["lastName"]} ${item["firstName"]}</td>
                <td class = 'hide'>${item["department"]}</td>
                <td class = 'hide'>${item["location"]}</td>
                <td class = '${item["personnelID"]}_email hide'>${item["email"]}</td>
                <td>
                  <button type="button" class="btn btn-outline-secondary edit_employee ${item["personnelID"]}" data-bs-toggle="modal" data-bs-target=".edit_personnel_modal" >
                    ${edit}
                  </button>
                </td>
                <td>
                  <button type="button" class="btn btn-outline-secondary delete_employee ${item["personnelID"]}" data-bs-toggle="modal" data-bs-target=".delete_personnel_modal">
                    ${bin}
                  </button>
                </td>
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

  // search filter function
  $(".search").on("input", (e) => {
    filter_search();
  });

  //////
  ////// Department functions
  //////

  // edit department modal population
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
                <button type="button" class="btn btn-outline-secondary edit_department btn-sm ${item.id}_button" data-bs-toggle="modal" data-bs-target=".confirm_edit_department_modal" >
                  <i class="fa-solid fa-pen-to-square"></i>
                </button>
                <button type="button" class="btn btn-outline-secondary btn-sm delete_department ${item.id}_button" >
                  <i class="fa-solid fa-trash"></i>
                </button>
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
                    const first_option = $(`.${select.id}_button_location_ID`)
                      .first()
                      .val();

                    if (location.locationID !== first_option) {
                      $(`.${select.id}_button_location_ID`).append(
                        $("<option>", {
                          value: location.locationID,
                          text: location.location,
                        })
                      );
                    }
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

  $(".department_modal").on("show.bs.modal", () => {
    get_all_departments();
  });

  // edit department submit handling

  let edit_target_departmentID;
  let edit_target_department;
  let edit_target_location_ID;

  $(".confirm_edit_department_modal").on("show.bs.modal", (e) => {
    target = e.relatedTarget.classList[4];
    $(".edit_d_name").text($(`.${target}_department_name`).val());

    edit_target_department = $(`.${target}_department_name`).val();

    edit_target_departmentID = $(`.${target}_department_name`).attr("id");
    edit_target_location_ID = $(`.${target}_location_ID`).val();
  });

  $(".final_edit_department_confirm").on("click", () => {
    $(".edit_department_form").submit();
  });

  $(".edit_department_form").on("submit", (e) => {
    e.preventDefault();
    $.ajax({
      url: "./server/department/updateDepartmentByID.php",
      type: "POST",
      dataType: "json",
      data: {
        department: edit_target_department,
        department_ID: edit_target_departmentID,
        location_ID: edit_target_location_ID,
      },

      success: function (result) {
        getAll();
        $(".department_modal").modal("toggle");
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(errorThrown);
        console.log(textStatus);
        console.log(jqXHR);
      },
    });
  });

  // insert department modal population

  // insert department submit hadling

  $(".add_department_modal").on("show.bs.modal", (e) => {
    $(".add_department_modal-input_group").html("");
    $(".add_department_modal-input_group").append(
      ` <div class="input-group insert_department_text">
                <input type="text" value="" aria-label="department name" class="form-control insert_department_name">
                <select class="form-select insert_button_location_ID">
                
                </select>
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

  $(".confirm_insert_modal").on("show.bs.modal", (e) => {
    $(".insert_d_name").text($(`.insert_department_name`).val());
  });

  $(".final_insert_department_confirm").click(function () {
    $(".insert_department_form").submit();
  });

  $(".insert_department_form").on("submit", (e) => {
    e.preventDefault();
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
    const target = e.currentTarget.classList[4];
    delete_target = $(`.${target}_department_name`).attr("id");

    $.ajax({
      url: "./server/department/checkDepartmentDependency.php",
      type: "POST",
      dataType: "json",
      data: {
        department_ID: delete_target,
      },

      success: function (result) {
        if (result.status.code === "400") {
          get_all_departments();
          $(".delete_error").modal("toggle");
        } else {
          $(".confirm_delete_modal").modal("toggle");
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(errorThrown);
        console.log(textStatus);
        console.log(jqXHR);
      },
    });
  });

  $(".confirm_delete_modal").on("show.bs.modal", (e) => {
    $.ajax({
      url: "./server/department/getDepartmentByID.php",
      type: "POST",
      data: {
        id: delete_target,
      },

      success: function (result) {
        $(".delete_d_name").text(result.data[0].name);
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(errorThrown);
        console.log(textStatus);
        console.log(jqXHR);
      },
    });
  });

  $(".final_delete_department_confirm").on("click", (e) => {
    e.preventDefault();
    $.ajax({
      url: "./server/department/deleteDepartmentByID.php",
      type: "POST",
      data: {
        department_ID: delete_target,
      },

      success: function (second_result) {
        if (second_result.status.code === "400") {
          get_all_departments();
          $(".delete_error").modal("toggle");
        } else {
          get_all_departments();
          getAll();
          $(".confirm_delete_modal").modal("toggle");
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
                
                <button type="button" class="btn btn-outline-secondary edit_location btn-sm ${item.locationID}_button" data-bs-toggle="modal" data-bs-target=".confirm_edit_location_modal">${edit}</button>
                <button type="button" class="btn btn-outline-secondary btn-sm delete_location ${item.locationID}_button">${bin}</button>
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

  $(".location_modal").on("show.bs.modal", () => {
    get_all_locations();
  });

  // // edit location submit handling

  let edit_target_location_name;
  let edit_target_locationID;

  $(".location_modal-input_group").on("click", ".edit_location", (e) => {
    target = e.currentTarget.classList[4];

    edit_target_location_name = $(`.${target}_location_name`).val();
    edit_target_locationID = $(`.${target}_location_name`).attr("id");
    $(".edit_l_name").text(edit_target_location_name);
  });

  $(".final_edit_location_confirm").on("click", (e) => {
    $(".edit_location_form").submit();
  });

  $(".edit_location_form").on("submit", (e) => {
    e.preventDefault();
    $.ajax({
      url: "./server/location/updateLocationByID.php",
      type: "POST",
      dataType: "json",
      data: {
        location: edit_target_location_name,
        locationID: edit_target_locationID,
      },

      success: function (result) {
        get_all_locations();
        getAll();
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(errorThrown);
        console.log(textStatus);
        console.log(jqXHR);
      },
    });
  });

  // // insert location submit hadling

  $(".location_modal").on("show.bs.modal", () => {
    get_all_locations();
  });

  $(".confirm_insert_location_modal").on("show.bs.modal", () => {
    $(".insert_l_name").text($(".insert_location_name").val());
  });

  $(".final_insert_location_confirm").on("click", (e) => {
    $(".insert_location_form").submit();
  });

  $(".insert_location_form").on("submit", (e) => {
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
    const target = e.currentTarget.classList[4];
    delete_location_target = $(`.${target}_location_name`).attr("id");
    $.ajax({
      url: "./server/location/checkLocationDependency.php",
      type: "POST",
      dataType: "json",
      data: {
        location_ID: delete_location_target,
      },

      success: function (result) {
        if (result.status.code === "400") {
          $(".delete_error").modal("toggle");
        } else {
          $(".confirm_delete_location_modal").modal("toggle");
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(errorThrown);
        console.log(textStatus);
        console.log(jqXHR);
      },
    });
  });

  $(".confirm_delete_location_modal").on("show.bs.modal", (e) => {
    $.ajax({
      url: "./server/location/getLocationByID.php",
      type: "POST",
      data: {
        id: delete_location_target,
      },

      success: function (result) {
        $(".delete_l_name").text(result.data[0].name);
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(errorThrown);
        console.log(textStatus);
        console.log(jqXHR);
      },
    });
  });

  $(".final_delete_location_confirm").on("click", (e) => {
    e.preventDefault();
    $.ajax({
      url: "./server/location/deleteLocationByID.php",
      type: "POST",
      data: {
        location_ID: delete_location_target,
      },

      success: function (second_result) {
        if (second_result.status.code === "400") {
          get_all_departments();
          $(".delete_error").modal("toggle");
        } else {
          get_all_locations();
          get_all_departments();
          getAll();
          $(".confirm_delete_location_modal").modal("toggle");
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

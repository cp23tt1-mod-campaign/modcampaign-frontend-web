import assets from "../utils/assets";
import { useSelector, useDispatch } from "react-redux";
import {
  setDefaultUserState,
  setPagination,
  setUserList,
} from "../store/user/userSlice";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import axios from "axios";
import DropDown from "../component/dropDown";

const Home = () => {
  const userState = useSelector((state) => state.user);
  const pagination = useSelector((state) => state.user.pagination);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const getUserList = async (currPage, currPageSize) => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/users`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        params: {
          currentPage: currPage || 1,
          pageSize: currPageSize || 10,
        },
      });
      if (res.status === 200) {
        dispatch(setUserList(res.data.data.users));
        dispatch(setPagination(res.data.data.pagination));
        return res;
      }
    } catch (error) {
      console.log(error.response);
    }
  };
  useEffect(() => {
    getUserList();
  }, [dispatch]);
  const getPageDisplay = () => {
    const currentPage = pagination.currentPage;
    const pageNum = pagination.totalPages;
    const pageList = [];
    if (pageNum < 11 || pageNum <= 4) {
      for (let i = 1; i <= pageNum; i++) {
        pageList.push({ page: i, display: i });
      }
      // }
    } else {
      // push fist page number
      if (currentPage <= 2) {
        pageList.push({ page: 1, display: 1 });
      } else if (currentPage + 2 > pageNum || currentPage === 1) {
        pageList.push({ page: 1, display: 1 });
      }

      // push ... before active page number
      if (currentPage - 1 > 2) {
        pageList.push({ page: currentPage - 2, display: "..." });
      } else if (currentPage + 1 >= pageNum) {
        pageList.push({ page: currentPage - 2, display: "..." });
      }

      if (currentPage > 1) {
        if (currentPage + 1 !== pageNum) {
          pageList.push({
            page: currentPage - 1,
            display: currentPage - 1,
          });
        }
        pageList.push({ page: currentPage, display: currentPage });
      } else {
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          if (i > 1 && i < pageNum) {
            pageList.push({ page: i, display: i });
          }
        }
      }

      // push ... after active page number
      if (currentPage < pageNum - 1) {
        pageList.push({ page: currentPage + 2, display: "..." });
      }

      // push ... last page number
      if (currentPage !== pageNum) {
        pageList.push({ page: pageNum, display: pageNum });
      }
    }
    return pageList;
  };
  const changeUserRole = async (userId, role) => {
    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_API_URL}/user-role/${userId}`,
        {
          role: role,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      return res;
    } catch (error) {
      console.log(error.response);
    }
  };
  const signOut = async () => {
    const res = await Swal.fire({
      icon: "warning",
      title: `${"headerText" || "Warning"}`,
      text: "bodyText",
      imageWidth: "128px",
      imageHeight: "128px",
      imageAlt: "warning",
      customClass: "warning",
      reverseButtons: true,
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: "รับทราบ",
      allowOutsideClick: false,
    });
    if (res.isConfirmed) {
      localStorage.removeItem("accessToken");
      dispatch(setDefaultUserState());
      navigate("/login");
    }
  };
  const handleChange = async (toRole, userId, displayName, fromRole) => {
    if (toRole === fromRole) {
      return;
    }
    const res = await Swal.fire({
      icon: "warning",
      title: "Are you sure?",
      text: `Do you want to change role: ${displayName} from ${fromRole} to ${toRole}?`,
      imageWidth: "128px",
      imageHeight: "128px",
      imageAlt: "warning",
      customClass: "warning",
      reverseButtons: true,
      showCancelButton: false,
      showConfirmButton: true,
      showDenyButton: true,
      confirmButtonColor: "#05AB58",
      confirmButtonText: "Yes, change it!",
      denyButtonText: "No, cancel!",
      allowOutsideClick: false,
    });
    if (res.isConfirmed) {
      const res = await changeUserRole(userId, toRole);
      if (res.status === 200) {
        try {
          const resGetUser = await getUserList(
            pagination.currentPage,
            pagination.pageSize
          );
          if (resGetUser.status === 200) {
            // dispatch(setUserList(resGetUser.data.data.users));
            // dispatch(setPagination(resGetUser.data.data.pagination));
            await Swal.fire({
              icon: "success",
              title: `Changes User Role Successfully!`,
              showCancelButton: false,
              showConfirmButton: false,
              type: "success",
              allowOutsideClick: false,
              timer: 2000,
            });
          }
        } catch (error) {
          console.log(error.response);
        }
      }
    }
  };
  // dispatch({type: "user/setUser", payload: "Jirasin"});
  const filteredUserList = userState.userList.filter((user) => {
    if (searchText === "") {
      return user;
    } else if (
      user.displayName.toLowerCase().includes(searchText.toLowerCase()) ||
      user.email.toLowerCase().includes(searchText.toLowerCase())
    ) {
      return user;
    }
  });
  return (
    <div className="w-screen h-screen flex flex-col bg-bg">
      <div className="flex justify-between p-7 bg-white w-full shadow-md z-50">
        <div className="w-full flex space-x-2 items-center">
          <img
            src={assets.modcampaignLogo}
            alt="modcampaign-logo"
            className="w-8 h-8"
          />
          <span className="text-black font-bold text-header-3">
            ModCampaign
          </span>
        </div>
        <div className="w-full h-full flex justify-end space-x-9 items-center">
          {/* <img src={`https://lh3.googleusercontent.com/a/${userProfile?.profileImage}`} alt="modcampaign-logo" /> */}
          <div className="flex flex-col space-y-1">
            <span className="text-black text-sub-header-1 font-medium">
              {userState.displayName}
            </span>
            <span className="text-black text-body-1 font-regular">
              {userState.role}
            </span>
          </div>
          <img
            src={`https://lh3.googleusercontent.com/a/${userState.profileImage}`}
            alt="user-image"
            className="w-11 h-11 rounded-full"
          />
        </div>
      </div>
      <div className="w-full h-full flex">
        <div className="min-w-[16.75rem] h-full bg-white shadow-lg px-8 py-7 flex flex-col space-y-7">
          <div className="flex space-x-3 select-none cursor-pointer items-center">
            <span className="material-symbols-outlined text-orange text-header-1">
              manage_accounts
            </span>
            <span className="text-orange text-sub-header-1 font-medium">
              User Management
            </span>
          </div>
          <div className="border-b border-gray"></div>
          <div
            className="flex space-x-3 select-none cursor-pointer items-center"
            onClick={() => signOut()}
          >
            <span className="material-symbols-outlined text-gray text-header-1">
              logout
            </span>
            <span className="text-gray text-sub-header-1 font-medium">
              Log Out
            </span>
          </div>
        </div>
        <div className="w-full h-full relative flex flex-col">
          <div className="w-full h-full px-5 py-10 flex flex-col space-y-6">
            <span className="text-black text-header-2 font-bold">
              User Management
            </span>
            <div className="flex bg-white items-center py-3 px-5 rounded-xl space-x-5 shadow-sm">
              <span className="material-symbols-outlined text-header-3 text-black-2 select-none">
                search
              </span>
              <input
                type="text"
                placeholder="Search"
                className="outline-none flex-1 mr-2 placeholder:text-black-2 w-full"
                onChange={(e) => setSearchText(e.target.value)}
              />
              <span
                className={`${
                  searchText ? "cursor-pointer" : "cursor-not-allowed"
                } material-symbols-outlined text-black-2 text-header-3 select-none`}
                onClick={() => setSearchText("")}
              >
                close
              </span>
            </div>
            <div className="w-full h-[36.875rem] overflow-y-auto bg-white rounded-lg shadow-sm">
              <div className="w-full px-4 pt-4 pb-2 border-gray border-b-2 flex mb-1">
                <div className="w-1/12">
                  <span className="text-black text-sub-header-2 font-medium">
                    No.
                  </span>
                </div>
                <div className="w-3/6">
                  <span className="text-black text-sub-header-2 font-medium">
                    Name
                  </span>
                </div>
                <div className="w-3/6">
                  <span className="text-black text-sub-header-2 font-medium">
                    Email
                  </span>
                </div>
                <div className="w-1/6">
                  <span className="text-black text-sub-header-2 font-medium">
                    Role
                  </span>
                </div>
              </div>
              {userState.userList.length > 0 ? (
                // userState.userList.map((user, index) => {
                filteredUserList.map((user, index) => {
                  return (
                    <div
                      key={`user-${index}`}
                      className="flex items-center py-2 px-5 border-b border-gray-4"
                    >
                      <div className="w-1/12">
                        <span className="text-black text-sub-header-2 font-regular">
                          {user.num}
                        </span>
                      </div>
                      <div className="w-3/6 flex space-x-10 items-center">
                        <img
                          src={`https://lh3.googleusercontent.com/a/${user.profileImage}`}
                          alt="user-image"
                          className="w-9 h-9 rounded-full bg-bg border-white border-2 shadow-md"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = assets.defaultProfileImage;
                          }}
                        />
                        <span className="text-black text-sub-header-1 font-regular">
                          {user.displayName}
                        </span>
                      </div>
                      <div className="w-3/6">
                        <span className="text-black text-sub-header-2 font-regular">
                          {user.email}
                        </span>
                      </div>
                      <div className="w-1/6">
                        <DropDown
                          roleData={user.role}
                          handleChange={(data) =>
                            handleChange(
                              data,
                              user.userId,
                              user.displayName,
                              user.role
                            )
                          }
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="flex items-center justify-center h-full">
                  <span className="text-black-2 text-header-4 font-regular">
                    User data empty
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className="absolute bottom-0 w-full p-4 bg-white opacity-80 border-t-2 border-gray-4 flex justify-between items-center">
            <span className="text-gray text-body-1 font-regular">
              Showing {pagination.offset + 1} to {pagination.lastNum} of{" "}
              {pagination.totalCount} entries
            </span>
            <div className="flex flex-row items-center space-x-7">
              <div className="flex space-x-2 items-center">
                <span className="text-gray text-body-1 font-regular">
                  Display
                </span>
                <input
                  className="bg-white border-gray-3 border rounded w-12 py-1 pr-1 text-black text-body-1 font-regular text-center"
                  type="number"
                  name=""
                  id=""
                  value={pagination.pageSize}
                  onChange={async (e) => {
                    await dispatch(
                      setPagination({
                        ...pagination,
                        pageSize: e.target.value,
                      })
                    );

                    let typing = null;

                    if (typing) {
                      clearTimeout(typing);
                    }

                    typing = await setTimeout(async () => {
                      await getUserList(pagination.currentPage, e.target.value);
                    }, 1000);
                  }}
                />
              </div>
              <div className="flex flex-row items-center space-x-2">
                <div
                  onClick={async () => {
                    if (pagination.currentPage === 1) {
                      return;
                    }
                    dispatch(
                      setPagination({
                        ...pagination,
                        currentPage: pagination.currentPage - 1,
                      })
                    );
                    await getUserList(
                      pagination.currentPage - 1,
                      pagination.pageSize
                    );
                  }}
                  className={`${
                    pagination.currentPage === 1
                      ? "cursor-not-allowed"
                      : "cursor-pointer"
                  } flex items-center bg-gray-3 rounded px-2 py-2`}
                >
                  <span className="material-symbols-outlined select-none text-sub-header-1 font-regular text-black">
                    chevron_left
                  </span>
                </div>
                {getPageDisplay().map((i, index) => {
                  return (
                    <div
                      key={index}
                      className={`page-number ${
                        i.page == pagination.currentPage
                          ? "rounded bg-orange text-white"
                          : "text-gray"
                      } ${
                        i.page < 10 ? "px-3" : "px-2.5"
                      } rounded select-none py-1 cursor-pointer`}
                      // onClick={() => handleChangePage(i.page)}
                      onClick={async () => {
                        dispatch(
                          setPagination({ ...pagination, currentPage: i.page })
                        );
                        await getUserList(i.page, pagination.pageSize);
                      }}
                    >
                      <span className="text-sub-header-2 font-regular">
                        {i.display}
                      </span>
                    </div>
                  );
                })}
                <div
                  onClick={async () => {
                    if (pagination.currentPage === pagination.totalPages) {
                      return;
                    }
                    dispatch(
                      setPagination({
                        ...pagination,
                        currentPage: pagination.currentPage + 1,
                      })
                    );
                    await getUserList(
                      pagination.currentPage + 1,
                      pagination.pageSize
                    );
                  }}
                  className={`${
                    pagination.currentPage === pagination.totalPages
                      ? "cursor-not-allowed"
                      : " cursor-pointer"
                  } flex items-center bg-gray-3 rounded px-2 py-2`}
                >
                  <span className="material-symbols-outlined select-none text-sub-header-1 font-regular text-black">
                    chevron_right
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

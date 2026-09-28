/**
 * Full app bootstrap: Refine + Ant Design + React Router + auth.
 *
 * Adjust: API_URL, resources[], authProvider import, page imports, route paths.
 * See references/routing.md and references/antd-components.md for the pieces used here.
 */
import { Refine, Authenticated } from "@refinedev/core";
import dataProvider from "@refinedev/simple-rest"; // swap for a custom provider — see templates/data-provider.ts
import {
  ThemedLayoutV2,
  ThemedSiderV2,
  ThemedHeaderV2,
  ThemedTitleV2,
  AuthPage,
  RefineThemes,
  useNotificationProvider,
} from "@refinedev/antd";
import routerProvider, {
  CatchAllNavigate,
  NavigateToResource,
} from "@refinedev/react-router";
import { ConfigProvider, App as AntdApp } from "antd";
import { BrowserRouter, Routes, Route, Outlet } from "react-router";
import "@refinedev/antd/dist/reset.css";

import { authProvider } from "./providers/auth-provider";
import { PostList, PostCreate, PostEdit, PostShow } from "./pages/posts";

const API_URL = "https://api.fake-rest.refine.dev";

const App = () => {
  return (
    <BrowserRouter>
      <ConfigProvider theme={RefineThemes.Blue}>
        <AntdApp>
          <Refine
            dataProvider={dataProvider(API_URL)}
            routerProvider={routerProvider}
            authProvider={authProvider}
            notificationProvider={useNotificationProvider}
            resources={[
              {
                name: "posts",
                list: "/posts",
                create: "/posts/create",
                edit: "/posts/edit/:id",
                show: "/posts/show/:id",
                meta: { canDelete: true },
              },
            ]}
            options={{ syncWithLocation: true, warnWhenUnsavedChanges: true }}
          >
            <Routes>
              <Route
                element={
                  <Authenticated key="protected" fallback={<CatchAllNavigate to="/login" />}>
                    <ThemedLayoutV2
                      Sider={() => <ThemedSiderV2 />}
                      Header={() => <ThemedHeaderV2 />}
                      Title={({ collapsed }) => (
                        <ThemedTitleV2 collapsed={collapsed} text="My App" />
                      )}
                    >
                      <Outlet />
                    </ThemedLayoutV2>
                  </Authenticated>
                }
              >
                <Route path="/posts">
                  <Route index element={<PostList />} />
                  <Route path="create" element={<PostCreate />} />
                  <Route path="edit/:id" element={<PostEdit />} />
                  <Route path="show/:id" element={<PostShow />} />
                </Route>
              </Route>

              <Route
                element={
                  <Authenticated key="public" fallback={<Outlet />}>
                    <NavigateToResource />
                  </Authenticated>
                }
              >
                <Route path="/login" element={<AuthPage type="login" />} />
                <Route path="/register" element={<AuthPage type="register" />} />
                <Route path="/forgot-password" element={<AuthPage type="forgotPassword" />} />
                <Route path="/update-password" element={<AuthPage type="updatePassword" />} />
              </Route>
            </Routes>
          </Refine>
        </AntdApp>
      </ConfigProvider>
    </BrowserRouter>
  );
};

export default App;

# API请求及跨域问题

## 1. 安装axios

```bash
npm install axios
```

## 2. 请求封装

### 2.1 utils/request.ts

```typescript
import axios from "axios";
import type {AxiosRequestConfig, AxiosResponse, AxiosError, InternalAxiosRequestConfig} from "axios";

const service = axios.create({
    baseURL: 'http://127.0.0.1:8080/api',
    timeout: 10000,
})

export interface ApiResponse<T>{
    code: number;
    msg: string;
    data: T;
}

service.interceptors.request.use(
    (config: AxiosRequestConfig) =>{
        config.headers = {
            'Content-Type': 'application/json',
            ...config.headers,
        }
        return config as InternalAxiosRequestConfig
    }
)

service.interceptors.response.use(
    (response: AxiosResponse) =>{
        return response.data
    }
)

export default service
```

## 3. API接口定义

### 3.1 common.ts

```typescript
export interface Model {
    id: number;
    created_at: Date;
    updated_at: Date;
}

export interface PageInfo {
    page: number;
    page_size: number;
}

export interface PageResult<T> {
    list: T[];
    total: number;
}

export interface Hit<T> {
    _id: string;
    _source: T;
}
```

### 3.2 base.ts

```typescript
import service from "@/utils/request";
import type {ApiResponse} from "@/utils/request";

export interface CaptchaResponse {
    captcha_id: string;
    pic_path: string;
}

export const captcha = (): Promise<ApiResponse<CaptchaResponse>> => {
    return service({
        url: '/base/captcha',
        method: 'post',
    })
}

export interface EmailRequest {
    email: string;
    captcha: string;
    captcha_id: string;
}

export const sendEmailVerificationCode = (data: EmailRequest):Promise<ApiResponse<undefined>> => {
    return service({
        url: '/base/sendEmailVerificationCode',
        method: 'post',
        data: data,
    })
}

export const qqLoginURL = (): Promise<ApiResponse<string>> => {
    return service({
        url: '/base/qqLoginURL',
        method: 'get',
    })
}
```

### 3.3 user.ts

```typescript
import service from "@/utils/request";
import type {ApiResponse} from "@/utils/request";
import type {Model, PageInfo, PageResult} from "@/api/common";

export interface User extends Model {
    uuid: string;
    username: string;
    email: string;
    openid: string;
    avatar: string;
    address: string;
    signature: string;
    role_id: number;
    register: string;
    freeze: boolean;
}

export interface RegisterRequest {
    username: string;
    password: string;
    email: string;
    verification_code: string;
}

export const register = (data: RegisterRequest): Promise<ApiResponse<LoginResponse>> => {
    return service({
        url: '/user/register',
        method: 'post',
        data: data
    });
}

export interface LoginRequest {
    email: string;
    password: string;
    captcha: string;
    captcha_id: string;
}

export interface LoginResponse {
    user: User;
    access_token: string;
    access_token_expires_at: number;
}

export const login = (data: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
    return service({
        url: '/user/login',
        method: 'post',
        data: data
    });
}

export interface ForgotPasswordRequest {
    email: string;
    verification_code: string;
    new_password: string;
}

export const forgotPassword = (data: ForgotPasswordRequest): Promise<ApiResponse<undefined>> => {
    return service({
        url: '/user/forgotPassword',
        method: 'post',
        data: data
    });
}

export interface UserCardRequest {
    uuid: string;
}

export interface UserCardResponse {
    uuid: string;
    username: string;
    avatar: string;
    address: string;
    signature: string;
}

export const userCard = (data: UserCardRequest): Promise<ApiResponse<UserCardResponse>> => {
    return service({
        url: '/user/card',
        method: 'get',
        params: data
    });
}

export const logout = (): Promise<ApiResponse<undefined>> => {
    return service({
        url: '/user/logout',
        method: 'post',
    });
}

export interface UserResetPasswordRequest {
    password: string;
    new_password: string;
}

export const userResetPassword = (data: UserResetPasswordRequest): Promise<ApiResponse<undefined>> => {
    return service({
        url: '/user/resetPassword',
        method: 'put',
        data: data
    })
}

export const userInfo = (): Promise<ApiResponse<User>> => {
    return service({
        url: '/user/info',
        method: 'get',
    });
}

export interface UserChangeInfoRequest {
    username: string;
    address: string;
    signature: string;
}

export const userChangeInfo = (data: UserChangeInfoRequest): Promise<ApiResponse<undefined>> => {
    return service({
        url: '/user/changeInfo',
        method: 'put',
        data: data
    })
}

export const userWeather = (): Promise<ApiResponse<string>> => {
    return service({
        url: '/user/weather',
        method: 'get',
    })
}

export interface UserChartRequest {
    date: number;
}

export interface UserChartResponse {
    date_list: string[];
    login_data: number[];
    register_data: number[];
}

export const userChart = (data: UserChartRequest): Promise<ApiResponse<UserChartResponse>> => {
    return service({
        url: '/user/chart',
        method: 'get',
        params: data,
    })
}


export interface UserListRequest extends PageInfo {
    uuid: string | null;
    register: string | null;
}

export const userList = (data: UserListRequest): Promise<ApiResponse<PageResult<User>>> => {
    return service({
        url: '/user/list',
        method: 'get',
        params: data
    })
}

export interface UserOperation {
    id: number;
}

export const userFreeze = (data: UserOperation): Promise<ApiResponse<undefined>> => {
    return service({
        url: '/user/freeze',
        method: 'put',
        data: data
    })
}

export const userUnfreeze = (data: UserOperation): Promise<ApiResponse<undefined>> => {
    return service({
        url: '/user/unfreeze',
        method: 'put',
        data: data
    })
}

export interface UserLoginListRequest extends PageInfo {
    uuid: string | null;
}

export interface Login extends Model {
    user_id: string;
    user: User;
    login_method: string;
    ip: string;
    address: string;
    os: string;
    device_info: string;
    browser_info: string;
    status: string;
}

export const userLoginList = (data: UserLoginListRequest): Promise<ApiResponse<PageResult<Login>>> => {
    return service({
        url: '/user/loginList',
        method: 'get',
        params: data
    })
}
```

### 3.4 image.ts

```typescript
import type {Model, PageInfo, PageResult} from "@/api/common";
import type {ApiResponse} from "@/utils/request";
import service from "@/utils/request";

export interface Image extends Model {
    name: string;
    url: string;
    category: string;
    storage: string;
}

export interface ImageUploadResponse {
    url: string;
    ossType: string;
}

export interface ImageDeleteRequest {
    ids: number[];
}

export const imageDelete = (data: ImageDeleteRequest): Promise<ApiResponse<undefined>> => {
    return service({
        url: '/image/delete',
        method: 'delete',
        data: data,
    });
}

export interface ImageListRequest extends PageInfo {
    name: string | null;
    category: string | null;
    storage: string | null;
}

export const imageList = (data: ImageListRequest): Promise<ApiResponse<PageResult<Image>>> => {
    return service({
        url: '/image/list',
        method: 'get',
        params: data,
    });
}
```

### 3.5 article.ts

```typescript
import type {Hit, PageInfo, PageResult} from "@/api/common";
import type {ApiResponse} from "@/utils/request";
import service from "@/utils/request";

export interface Article {
    created_at: string;
    updated_at: string;

    cover: string;
    title: string;
    keyword: string;
    category: string;
    tags: string[];
    abstract: string;
    content: string;

    views: number;
    comments: number;
    likes: number;
}

export interface ArticleLikeRequest {
    article_id: string;
}

export const articleLike = (data: ArticleLikeRequest): Promise<ApiResponse<undefined>> => {
    return service({
        url: '/article/like',
        method: 'post',
        data: data
    })
}

export const articleIsLike = (data: ArticleLikeRequest): Promise<ApiResponse<boolean>> => {
    return service({
        url: '/article/isLike',
        method: 'get',
        params: data
    })
}

export const articleLikesList = (data: PageInfo): Promise<ApiResponse<PageResult<Hit<Article>>>> => {
    return service({
        url: '/article/likesList',
        method: 'get',
        params: data
    })
}

export interface ArticleCreateRequest {
    cover: string;
    title: string;
    category: string;
    tags: string[];
    abstract: string;
    content: string;
}

export const articleCreate = (data: ArticleCreateRequest): Promise<ApiResponse<undefined>> => {
    return service({
        url: '/article/create',
        method: 'post',
        data: data
    });
}

export interface ArticleDeleteRequest {
    ids: string[];
}

export const articleDelete = (data: ArticleDeleteRequest): Promise<ApiResponse<undefined>> => {
    return service({
        url: '/article/delete',
        method: 'delete',
        data: data
    });
}

export interface ArticleUpdateRequest {
    id: string;
    cover: string;
    title: string;
    category: string;
    tags: string[];
    abstract: string;
    content: string;
}

export const articleUpdate = (data: ArticleUpdateRequest): Promise<ApiResponse<undefined>> => {
    return service({
        url: '/article/update',
        method: 'put',
        data: data
    });
}

export interface ArticleListRequest extends PageInfo {
    title: string | null;
    category: string | null;
    abstract: string | null;
}

export const articleList = (data: ArticleListRequest): Promise<ApiResponse<PageResult<Hit<Article>>>> => {
    return service({
        url: '/article/list',
        method: 'get',
        params: data,
    });
}

export const articleInfoByID = (id: string): Promise<ApiResponse<Article>> => {
    return service({
        url: '/article/'+id,
        method: 'get',
    });
}

export interface ArticleSearchRequest extends PageInfo {
    query: string;
    category: string;
    tag: string;
    sort: string;
    order: string;
}

export const articleSearch = (data: ArticleSearchRequest): Promise<ApiResponse<PageResult<Hit<Article>>>> => {
    return service({
        url: '/article/search',
        method: 'get',
        params: data,
    });
}

export interface ArticleCategory {
    category: string;
    number: number;
}

export const articleCategory = (): Promise<ApiResponse<ArticleCategory[]>> => {
    return service({
        url: '/article/category',
        method: 'get',
    });
}

export interface ArticleTag {
    tag: string;
    number: number;
}

export const articleTags = (): Promise<ApiResponse<ArticleTag[]>> => {
    return service({
        url: '/article/tags',
        method: 'get',
    });
}
```

### 3.6 comment.ts

```typescript
import type {Model, PageInfo, PageResult} from "@/api/common";
import service from "@/utils/request";
import type {ApiResponse} from "@/utils/request";
import type {User} from "@/api/user";

export interface Comment extends Model {
    article_id: string;
    p_id: number | null;
    children: Comment[];
    user_uuid: string;
    user: User;
    content: string;
}

export interface CommentCreateRequest {
    article_id: string;
    p_id: number | null;
    content: string;
}

export const commentCreate = (data: CommentCreateRequest): Promise<ApiResponse<undefined>> => {
    return service({
        url: '/comment/create',
        method: 'post',
        data: data,
    })
}

export interface CommentDeleteRequest {
    ids: number[];
}

export const commentDelete = (data: CommentDeleteRequest): Promise<ApiResponse<undefined>> => {
    return service({
        url: '/comment/delete',
        method: 'delete',
        data: data,
    })
}

export const commentInfo = (): Promise<ApiResponse<Comment[]>> => {
    return service({
        url: '/comment/info',
        method: 'get',
    });
}

export const commentInfoByArticleID = (article_id: string): Promise<ApiResponse<Comment[]>> => {
    return service({
        url: '/comment/' + article_id,
        method: 'get',
    })
}

export const commentNew = (): Promise<ApiResponse<Comment[]>> => {
    return service({
        url: '/comment/new',
        method: 'get',
    });
}

export interface CommentListRequest extends PageInfo {
    article_id: string | null;
    user_uuid: string | null;
    content: string | null;
}

export const commentList = (data: CommentListRequest): Promise<ApiResponse<PageResult<Comment>>> => {
    return service({
        url: '/comment/list',
        method: 'get',
        params: data,
    });
}
```

### 3.7 advertisement.ts

```typescript
import type {Model, PageInfo, PageResult} from "@/api/common";
import type {ApiResponse} from "@/utils/request";
import service from "@/utils/request";

export interface Advertisement extends Model {
    ad_image: string;
    link: string;
    title: string;
    content: string;
}

export interface AdvertisementInfoResponse {
    list: Advertisement[];
    total: number;
}

export const advertisementInfo = (): Promise<ApiResponse<AdvertisementInfoResponse>> => {
    return service({
        url: '/advertisement/info',
        method: 'get',
    })
}

export interface AdvertisementCreateRequest {
    ad_image: string;
    link: string;
    title: string;
    content: string;
}

export const advertisementCreate = (data: AdvertisementCreateRequest): Promise<ApiResponse<undefined>> => {
    return service({
        url: '/advertisement/create',
        method: 'post',
        data: data
    });
}

export interface AdvertisementDeleteRequest {
    ids: number[];
}

export const advertisementDelete = (data: AdvertisementDeleteRequest): Promise<ApiResponse<undefined>> => {
    return service({
        url: '/advertisement/delete',
        method: 'delete',
        data: data
    });
}

export interface AdvertisementUpdateRequest {
    id: number;
    link: string;
    title: string;
    content: string;
}

export const advertisementUpdate = (data: AdvertisementUpdateRequest): Promise<ApiResponse<undefined>> => {
    return service({
        url: '/advertisement/update',
        method: 'put',
        data: data
    });
}

export interface AdvertisementListRequest extends PageInfo {
    title: string | null;
    content: string | null;
}

export const advertisementList = (data: AdvertisementListRequest): Promise<ApiResponse<PageResult<Advertisement>>> => {
    return service({
        url: '/advertisement/list',
        method: 'get',
        params: data,
    });
}
```

### 3.8 friend-link.ts

```typescript
import service from "@/utils/request";
import type {ApiResponse} from "@/utils/request";
import type {Model, PageInfo, PageResult} from "@/api/common";

export interface FriendLink extends Model {
    logo: string;
    link: string;
    name: string;
    description: string;
}

export interface FriendLinkInfoResponse {
    list: FriendLink[]
    total: number
}

export const friendLinkInfo = (): Promise<ApiResponse<FriendLinkInfoResponse>> => {
    return service({
        url: '/friendLink/info',
        method: 'get',
    });
}

export interface FriendLinkCreateRequest {
    logo: string;
    link: string;
    name: string;
    description: string;
}

export const friendLinkCreate = (data: FriendLinkCreateRequest): Promise<ApiResponse<undefined>> => {
    return service({
        url: '/friendLink/create',
        method: 'post',
        data: data
    });
}

export interface FriendLinkDeleteRequest {
    ids: number[];
}

export const friendLinkDelete = (data: FriendLinkDeleteRequest): Promise<ApiResponse<undefined>> => {
    return service({
        url: '/friendLink/delete',
        method: 'delete',
        data: data
    });
}

export interface FriendLinkUpdateRequest {
    id: number;
    link: string;
    name: string;
    description: string;
}

export const friendLinkUpdate = (data: FriendLinkUpdateRequest): Promise<ApiResponse<undefined>> => {
    return service({
        url: '/friendLink/update',
        method: 'put',
        data: data
    });
}

export interface FriendLinkListRequest extends PageInfo {
    name: string | null;
    description: string | null;
}

export const friendLinkList = (data: FriendLinkListRequest): Promise<ApiResponse<PageResult<FriendLink>>> => {
    return service({
        url: '/friendLink/list',
        method: 'get',
        params: data,
    });
}
```

### 3.9 feedback.ts

```typescript
import type {ApiResponse} from "@/utils/request";
import service from "@/utils/request";
import type {Model, PageInfo, PageResult} from "@/api/common";

export interface Feedback extends Model{
    user_uuid: string;
    content: string;
    reply: string;
}

export interface FeedbackCreateRequest {
    content: string;
}

export const feedbackCreate = (data: FeedbackCreateRequest): Promise<ApiResponse<undefined>> => {
    return service({
        url: '/feedback/create',
        method: 'post',
        data: data
    });
}

export const feedbackInfo = (): Promise<ApiResponse<Feedback[]>> => {
    return service({
        url: '/feedback/info',
        method: 'get',
    });
}

export interface FeedbackDeleteRequest {
    ids: number[];
}

export const feedbackDelete = (data: FeedbackDeleteRequest): Promise<ApiResponse<undefined>> => {
    return service({
        url: '/feedback/delete',
        method: 'delete',
        data: data
    });
}

export interface FeedbackReplyRequest {
    id: number;
    reply: string;
}

export const feedbackReply = (data: FeedbackReplyRequest): Promise<ApiResponse<undefined>> => {
    return service({
        url: '/feedback/reply',
        method: 'put',
        data: data
    });
}

export const feedbackList = (data: PageInfo): Promise<ApiResponse<PageResult<Feedback>>> => {
    return service({
        url: '/feedback/list',
        method: 'get',
        params: data,
    });
}

export const feedbackNew = (): Promise<ApiResponse<Feedback[]>> => {
    return service({
        url: '/feedback/new',
        method: 'get',
    });
}
```

### 3.10 website.ts

```typescript
import type {ApiResponse} from "@/utils/request";
import service from "@/utils/request";
import type {Website} from "@/api/config";

export const websiteInfo = (): Promise<ApiResponse<Website>> => {
    return service({
        url: '/website/info',
        method: 'get',
    })
}

export const websiteCarousel = (): Promise<ApiResponse<string[]>> => {
    return service({
        url: '/website/carousel',
        method: 'get',
    })
}

export interface WebsiteNewsRequest {
    source: string;
}

export interface HotItem {
    index: number;
    title: string;
    description: string;
    image: string;
    popularity: string;
    url: string;
}

export interface HotSearchData {
    source: string;
    update_time: string;
    hot_list: HotItem[];
}

export const websiteNews = (data: WebsiteNewsRequest): Promise<ApiResponse<HotSearchData>> => {
    return service({
        url: '/website/news',
        method: 'get',
        params: data,
    })
}

export interface WebsiteCalendarResponse {
    date: string;
    lunar_date: string;
    ganzhi: string;
    zodiac: string;
    day_of_year: string;
    solar_term: string;
    auspicious: string;
    inauspicious: string;
}

export const websiteCalendar = (): Promise<ApiResponse<WebsiteCalendarResponse>> => {
    return service({
        url: '/website/calendar',
        method: 'get',
    })
}

export interface FooterLink {
    title: string;
    link: string;
}

export const websiteFooterLink = (): Promise<ApiResponse<FooterLink[]>> => {
    return service({
        url: '/website/footerLink',
        method: 'get',
    })
}

export interface WebsiteCarouselOperation {
    url: string
}

export const websiteAddCarousel = (data: WebsiteCarouselOperation): Promise<ApiResponse<undefined>> => {
    return service({
        url: '/website/addCarousel',
        method: 'post',
        data: data,
    })
}

export const websiteCancelCarousel = (data: WebsiteCarouselOperation): Promise<ApiResponse<undefined>> => {
    return service({
        url: '/website/cancelCarousel',
        method: 'put',
        data: data,
    })
}

export const websiteCreateFooterLink = (data: FooterLink): Promise<ApiResponse<undefined>> => {
    return service({
        url: '/website/createFooterLink',
        method: 'post',
        data: data,
    })
}

export const websiteDeleteFooterLink = (data: FooterLink): Promise<ApiResponse<undefined>> => {
    return service({
        url: '/website/deleteFooterLink',
        method: 'delete',
        data: data,
    })
}
```

### 3.11 config.ts

```typescript
import type {ApiResponse} from "@/utils/request";
import service from "@/utils/request";

export interface Website {
    logo: string;
    full_logo: string;
    title: string;
    slogan: string;
    slogan_en: string;
    description: string;
    version: string;
    created_at: string;
    icp_filing: string;
    public_security_filing: string;
    bilibili_url: string;
    gitee_url: string;
    github_url: string;
    name: string;
    job: string;
    address: string;
    email: string;
    qq_image: string;
    wechat_image: string;
}

export const getWebsite = (): Promise<ApiResponse<Website>> => {
    return service({
        url: '/config/website',
        method: 'get',
    })
}

export const updateWebsite = (data: Website): Promise<ApiResponse<undefined>> => {
    return service({
        url: '/config/website',
        method: 'put',
        data: data,
    })
}

export interface System{
    use_multipoint:boolean;
    sessions_secret:string;
    oss_type:string;
}

export const getSystem = (): Promise<ApiResponse<System>> => {
    return service({
        url: '/config/system',
        method: 'get',
    })
}

export const updateSystem = (data: System): Promise<ApiResponse<undefined>> => {
    return service({
        url: '/config/system',
        method: 'put',
        data: data,
    })
}

export interface Email {
    host: string;
    port: number;
    from: string;
    nickname: string;
    secret: string;
    is_ssl: boolean;
}

export const getEmail = (): Promise<ApiResponse<Email>> => {
    return service({
        url: '/config/email',
        method: 'get',
    })
}

export const updateEmail = (data: Email): Promise<ApiResponse<undefined>> => {
    return service({
        url: '/config/email',
        method: 'put',
        data: data,
    })
}

export interface QQ {
    enable: boolean;
    app_id: string;
    app_key: string;
    redirect_uri: string;
}

export const getQQ = (): Promise<ApiResponse<QQ>> => {
    return service({
        url: '/config/qq',
        method: 'get',
    })
}

export const updateQQ = (data: QQ): Promise<ApiResponse<undefined>> => {
    return service({
        url: '/config/qq',
        method: 'put',
        data: data,
    })
}

export interface Qiniu {
    zone: string;
    bucket: string;
    img_path: string;
    access_key: string;
    secret_key: string;
    use_https: boolean;
    use_cdn_domains: boolean;
}

export const getQiniu = (): Promise<ApiResponse<Qiniu>> => {
    return service({
        url: '/config/qiniu',
        method: 'get',
    })
}

export const updateQiniu = (data: Qiniu): Promise<ApiResponse<undefined>> => {
    return service({
        url: '/config/qiniu',
        method: 'put',
        data: data,
    })
}

export interface Jwt {
    access_token_secret: string;
    refresh_token_secret: string;
    access_token_expiry_time: string;
    refresh_token_expiry_time: string;
    issuer: string;
}

export const getJwt = (): Promise<ApiResponse<Jwt>> => {
    return service({
        url: '/config/jwt',
        method: 'get',
    })
}

export const updateJwt = (data: Jwt): Promise<ApiResponse<undefined>> => {
    return service({
        url: '/config/jwt',
        method: 'put',
        data: data,
    })
}

export interface Gaode {
    enable: boolean;
    key: string;
}

export const getGaode = (): Promise<ApiResponse<Gaode>> => {
    return service({
        url: '/config/gaode',
        method: 'get',
    })
}

export const updateGaode = (data: Gaode): Promise<ApiResponse<undefined>> => {
    return service({
        url: '/config/gaode',
        method: 'put',
        data: data,
    })
}
```

## 4. 跨域问题解决方案

### 4.1 本地测试配置

#### 4.1.1 env.d.ts

```typescript
/// <reference types="vite/client" />

export interface ImportMetaEnv {
    VITE_SERVER_URL: string
}
```

#### 4.1.2 .env

```
VITE_SERVER_URL = http://127.0.0.1:8080
VITE_BASE_API = /api
```

#### 4.1.3 vite.config.ts

```typescript
import {fileURLToPath, URL} from 'node:url'

import {defineConfig, loadEnv} from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import {ElementPlusResolver} from 'unplugin-vue-components/resolvers'
import type {ImportMetaEnv} from "./env";

let env: Record<keyof ImportMetaEnv, string> = loadEnv("", process.cwd())

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        AutoImport({
            resolvers: [ElementPlusResolver()],
        }),
        Components({
            resolvers: [ElementPlusResolver()],
        }),
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    server: {
        host: "0.0.0.0",
        port: 80,
        proxy: {
            "/api": {
                target: env.VITE_SERVER_URL,
                changeOrigin: true
            },
            "/uploads": {
                target: env.VITE_SERVER_URL,
                changeOrigin: true,
            },
        }
    }
})
```

#### 4.1.4 utils/request.ts

```typescript
......

const service = axios.create({
    baseURL: import.meta.env.VITE_BASE_API,
    timeout: 10000,
})

......
```

### 4.2 其他解决方案

1. **gin使用cors中间件**
2. **nginx配置cors**
3. **修改index.html**

#### 4.2.1 index.html

```html
<!DOCTYPE html>
<html lang="zh">
  <head>
    <meta charset="UTF-8">
    <link rel="icon" href="http://127.0.0.1:8080/api/website/logo">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title></title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  <script>
      fetch('/api/website/title')
          .then(response => response.json())
          .then(data => {
              document.title = data.title
          })
  </script>
  </body>
</html>
```
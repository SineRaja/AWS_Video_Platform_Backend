
## Environment Setup

1. Create a new environment in Postman and add these variables:
   - `baseUrl`: `http://localhost:8001/api`
   - `token`: (leave empty initially - will be filled after login)

Now, let's create the test collections:

# Authentication Tests

## 1. User Signup

```
POST {{baseUrl}}/auth/signup
```

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "name": "testuser1",
  "email": "testuser1@example.com",
  "password": "Test@123",
  "phoneNumber": "1234567890",
  "address": "123 Test Street"
}
```

**Tests:**
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("User creation success message", function () {
    pm.expect(pm.response.text()).to.include("User has been created");
});
```

## 2. User Login

```
POST {{baseUrl}}/auth/signin
```

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "name": "testuser1",
  "password": "Test@123"
}
```

**Tests:**
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response has user data", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.name).to.eql("testuser1");
    pm.expect(jsonData._id).to.exist;
});

// Save token from cookies
pm.test("Save auth token", function () {
    const cookieHeader = pm.cookies.get("access_token");
    if (cookieHeader) {
        pm.environment.set("token", cookieHeader);
        console.log("Token saved:", cookieHeader);
    }
});
```

## 3. Google Auth

```
POST {{baseUrl}}/auth/google
```

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "name": "Google User",
  "email": "googleuser@example.com",
  "img": "https://example.com/profile.jpg"
}
```

**Tests:**
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response has user data", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.name).to.eql("Google User");
    pm.expect(jsonData.fromGoogle).to.be.true;
});
```

## 4. Logout

```
POST {{baseUrl}}/auth/logout
```

**Tests:**
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Logout success message", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.message).to.include("Logged out successfully");
});

// Clear token
pm.environment.set("token", "");
```

# User Management Tests

## 1. Get User

```
GET {{baseUrl}}/users/find/{{userId}}
```

**Tests:**
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("User data is returned", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData._id).to.exist;
    pm.expect(jsonData.name).to.exist;
});
```

## 2. Update User

```
PUT {{baseUrl}}/users/{{userId}}
```

**Headers:**
```
Content-Type: application/json
Cookie: access_token={{token}}
```

**Body:**
```json
{
  "name": "Updated Name",
  "phoneNumber": "9876543210",
  "address": "456 Updated Street"
}
```

**Tests:**
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("User data is updated", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.name).to.eql("Updated Name");
    pm.expect(jsonData.phoneNumber).to.eql("9876543210");
});
```

## 3. Subscribe to Channel

```
PUT {{baseUrl}}/users/sub/{{channelId}}
```

**Headers:**
```
Cookie: access_token={{token}}
```

**Tests:**
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Subscription successful", function () {
    pm.expect(pm.response.text()).to.include("Subscription Successful");
});
```

## 4. Unsubscribe from Channel

```
PUT {{baseUrl}}/users/unsub/{{channelId}}
```

**Headers:**
```
Cookie: access_token={{token}}
```

**Tests:**
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Unsubscription successful", function () {
    pm.expect(pm.response.text()).to.include("Unsubscription Successful");
});
```

## 5. Like Video

```
PUT {{baseUrl}}/users/like/{{videoId}}
```

**Headers:**
```
Cookie: access_token={{token}}
```

**Tests:**
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Like successful", function () {
    pm.expect(pm.response.text()).to.include("Video has been liked");
});
```

## 6. Dislike Video

```
PUT {{baseUrl}}/users/dislike/{{videoId}}
```

**Headers:**
```
Cookie: access_token={{token}}
```

**Tests:**
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Dislike successful", function () {
    pm.expect(pm.response.text()).to.include("Video has been disliked");
});
```

## 7. Delete User

```
DELETE {{baseUrl}}/users/{{userId}}
```

**Headers:**
```
Cookie: access_token={{token}}
```

**Tests:**
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Delete successful", function () {
    pm.expect(pm.response.text()).to.include("User has been deleted");
});
```

# Video Management Tests

## 1. Add Video

```
POST {{baseUrl}}/videos
```

**Headers:**
```
Content-Type: application/json
Cookie: access_token={{token}}
```

**Body:**
```json
{
  "title": "Test Video",
  "videoDescription": "This is a test video description",
  "imgURL": "https://example.com/thumbnail.jpg",
  "videoUrl": "https://example.com/video.mp4",
  "tags": ["test", "video", "api"]
}
```

**Tests:**
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Video created successfully", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData._id).to.exist;
    pm.expect(jsonData.title).to.eql("Test Video");
    
    // Save the video ID for future tests
    pm.environment.set("videoId", jsonData._id);
});
```

## 2. Get Video

```
GET {{baseUrl}}/videos/find/{{videoId}}
```

**Headers:**
```
Cookie: access_token={{token}}
```

**Tests:**
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Video data is returned", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData._id).to.eql(pm.environment.get("videoId"));
    pm.expect(jsonData.title).to.exist;
});
```

## 3. Update Video

```
PUT {{baseUrl}}/videos/{{videoId}}
```

**Headers:**
```
Content-Type: application/json
Cookie: access_token={{token}}
```

**Body:**
```json
{
  "title": "Updated Video Title",
  "videoDescription": "Updated video description",
  "tags": ["updated", "test", "api"]
}
```

**Tests:**
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Video updated successfully", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.title).to.eql("Updated Video Title");
});
```

## 4. Add View

```
PUT {{baseUrl}}/videos/view/{{videoId}}
```

**Tests:**
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("View count increased", function () {
    pm.expect(pm.response.text()).to.include("The View has been increased");
});
```

## 5. Get Trending Videos

```
GET {{baseUrl}}/videos/trendvideo
```

**Tests:**
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Returns list of videos", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.be.an('array');
});
```

## 6. Get Random Videos

```
GET {{baseUrl}}/videos/randomvideo
```

**Tests:**
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Returns list of random videos", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.be.an('array');
});
```

## 7. Get Subscription Videos

```
GET {{baseUrl}}/videos/subscribevideos
```

**Headers:**
```
Cookie: access_token={{token}}
```

**Tests:**
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Returns list of subscription videos", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.be.an('array');
});
```

## 8. Get Videos by Tags

```
GET {{baseUrl}}/videos/tags?tags=test,api
```

**Tests:**
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Returns videos with matching tags", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.be.an('array');
});
```

## 9. Search Videos

```
GET {{baseUrl}}/videos/search?q=test
```

**Tests:**
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Returns search results", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.be.an('array');
});
```

## 10. Delete Video

```
DELETE {{baseUrl}}/videos/{{videoId}}
```

**Headers:**
```
Cookie: access_token={{token}}
```

**Tests:**
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Video deleted successfully", function () {
    pm.expect(pm.response.text()).to.include("The Video has been Deleted");
});
```

# Comment Management Tests

## 1. Add Comment

```
POST {{baseUrl}}/comment
```

**Headers:**
```
Content-Type: application/json
Cookie: access_token={{token}}
```

**Body:**
```json
{
  "videoId": "{{videoId}}",
  "comment": "This is a test comment!"
}
```

**Tests:**
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Comment added successfully", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData._id).to.exist;
    pm.expect(jsonData.comment).to.eql("This is a test comment!");
    
    // Save comment ID for future tests
    pm.environment.set("commentId", jsonData._id);
});
```

## 2. Get Comments for Video

```
GET {{baseUrl}}/comment/{{videoId}}
```

**Headers:**
```
Cookie: access_token={{token}}
```

**Tests:**
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Returns list of comments", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.be.an('array');
});
```

## 3. Delete Comment

```
DELETE {{baseUrl}}/comment/{{commentId}}
```

**Headers:**
```
Cookie: access_token={{token}}
```

**Tests:**
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Comment deleted successfully", function () {
    pm.expect(pm.response.text()).to.include("The Comment has been deleted");
});
```

# Postman Collection Setup

You can organize these tests into folders in your Postman collection:

1. **Authentication** - For signup, signin, Google auth, and logout
2. **Users** - For user management endpoints
3. **Videos** - For video management endpoints
4. **Comments** - For comment management endpoints

## Testing Flow

For proper testing, follow this sequence:
1. Register a user
2. Login to get the authentication token
3. Create a video to get videoId
4. Run tests for video operations
5. Run tests for comment operations
6. Run tests for user operations
7. Clean up (delete comments, videos, user)


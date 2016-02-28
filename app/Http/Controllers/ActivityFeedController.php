<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Post;

class ActivityFeedController extends Controller
{
    /*
        handles POST request from client
        adds a status to activityfeed
        @return json ... status of action
    **/
    public function addstatus(Request $request)
    {
        $post = new Post;
        $post->email = $request->Email;
        $post->firstname = $request->Fname;
        $post->post_text = $request->Status;
        $post->attachment = 'txt';

        if ($posts = $post->save()) {
            return response()->json(['posts' => $posts, 'status' => 201], 201);
        } else {
            return response()->json(['status' => 404], 404);
        }
    }

    /*
        returns status data for GET request
        @return json
    **/
    public function getstatus(Request $request)
    {
        if ($posts = \DB::select('select id,firstname,post_text,created_at from posts')) {
            return response()->json(['posts' => $posts, 'status' => 200], 200);
        } else {
            return response()->json(['status' => 505], 505);
        }
    }

    /*
        returns post id for GET request
        @return json
    **/
    public function getpostId(Request $request)
    {
        if ($posts = \DB::select('select id from posts')) {
            return response()->json(['posts' => $posts, 'status' => 200], 200);
        } else {
            return response()->json(['status' => 505], 505);
        }
    }

    public function checkpost(Request $request)
    {
        $id = $request->PId;
        $email = $request->Email;

        $result = Post::where('id', $id)
            ->where('email', $email)->get();

        if ($result->isEmpty()) {
            return 'false';
        } else {
            return 'true';
        }

    }

    public function deleteStatus(Request $request)
    {
        $id = $request->PostId;
        $posts = \DB::table('posts')->where('id', '=', $id);

        if ($posts->delete()) {
            return response()->json(['status' => 201], 201);
        } else {
            return response()->json(['status' => 404], 404);
        }
    }

    public function editStatus(Request $request)
    {
        $id = $request->PostId;
        $status = $request->Status;

        $posts = \DB::table('posts')->where('id', $id)->update(['post_text' => $status]);

        if ($posts) {
            return response()->json(['status' => 201], 201);
        } else {
            return response()->json(['status' => 404], 404);
        }
    }
}

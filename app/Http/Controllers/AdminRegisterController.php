<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\User;

class AdminRegisterController extends Controller
{
    //checks whether user is already registered and save data
    public function checks(Request $request)
    {
        $email = $request->email;
        $admin = User::where('email', $email)->first();
        if ($admin == null) {
            $admin = new User;
            $admin->firstname = $request->firstname;
            $admin->lastname = $request->lastname;
            $admin->job = $request->job;
            $admin->email = $request->email;
            $admin->role = 'admin';
            $admin->password = \Hash::make($request->password);
            if ($admin->save()) {
                return response()->json(['status' => 201], 201);
            } else {
                return response()->json(['status' => 404], 404);
            }
        } else {
            return response()->json(['status' => 200], 200);
        }
    }

    public function update(Request $request)
    {
        $email = $request->email;
        $id = $request->id;
        $job = $request->job;
        $firstname = $request->firstname;
        $lastname = $request->lastname;
        //checks whether new email is already in the database //old and new email can be similler for the selected admin only
        $admin = \DB::select('SELECT email FROM users WHERE email = "'.$email.'" not in (select email from users where id!='.$id.')');
        if ($admin == null) {
            //update
            \DB::table('users')
                ->where('id', $id)
                ->update(['firstname' => $firstname, 'lastname' => $lastname, 'job' => $job, 'email' => $email]);

            return response()->json(['you can use this email' => $admin, 'status' => 200], 200);
        } else {
            return response()->json(['email' => 'email already exists', 'status' => 201], 201);
        }
    }
    public function uploadpic(Request $request)
    {
        $destination = 'img/profilepics';
        try {
            $apitoken = $request->input('apitoken');
            $id = $request->input('id');
            $file = $request->file('file')->move($destination, $id);
            $ext = $request->file('file')->getClientOriginalExtension();
            User::where('id', $id)
                ->update(['profilepic' => $id.'.'.$ext]);

            return response()->json(['status' => 200, 'done' => true], 200);
        } catch (Exception $e) {
            return response()->json(['status' => 200, 'done' => false], 200);
        }
    }
    public function SendMail($email, $user, $pwd)
    {
        $mail = new PHPMailer;
        $mail->SMTPDebug = 1;                               // Enable verbose debug output
        $mail->isSMTP();                                      // Set mailer to use SMTP
        $mail->Host = 'ssl://smtp.gmail.com';  // Specify main and backup SMTP servers
        $mail->SMTPAuth = true;                               // Enable SMTP authentication
        $mail->Username = 'coupleyteam@gmail.com';                // SMTP username
        $mail->Password = 'COUPLEY123';                           // SMTP password
        $mail->SMTPSecure = 'ssl';                            // Enable TLS encryption, `ssl` also accepted
        $mail->Port = 465;                                    // TCP port to connect to
        $mail->From = 'coupleyteam@gmail.com';
        $mail->FromName = 'COUPLEY';
        $mail->addAddress($email, $user);     // Add a recipient
        $mail->addReplyTo('coupleyteam@gmail', 'COUPLEY');
        $mail->addBCC('bcc@example.com');
        $mail->isHTML(true);                                  // Set email format to HTML
        $mail->Subject = 'COUPLEY New Administrator';
        $mail->Body = 'Dear '.$user.', You are assigned as an administrator of the CoupleyTeam. Your Username: '.$email.' Password: '.$pwd;
        $mail->AltBody = 'This is the body in plain text for non-HTML mail clients';

        if (! $mail->send()) {
            echo 'Message could not be sent.';
            echo 'Mailer Error: '.$mail->ErrorInfo;
        } else {
            echo 'Message has been sent';
        }
    }
}

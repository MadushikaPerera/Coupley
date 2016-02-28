import React from 'react';
import Card from 'material-ui/lib/card/card';
import ListItem from 'material-ui/lib/lists/list-item';
import Divider from 'material-ui/lib/divider';
import Avatar from 'material-ui/lib/avatar';
import Colors from 'material-ui/lib/styles/colors';
import FavIcon from 'material-ui/lib/svg-icons/action/favorite';
import FavIconBorder from 'material-ui/lib/svg-icons/action/favorite-border';
import IconButton from 'material-ui/lib/icon-button';
import MoreVertIcon from 'material-ui/lib/svg-icons/navigation/more-vert';
import IconMenu from 'material-ui/lib/menus/icon-menu';
import MenuItem from 'material-ui/lib/menus/menu-item';
import FlatButton from 'material-ui/lib/flat-button';
import Paper from 'material-ui/lib/paper';
import LikesActions from '../../actions/ActivityFeed/LikesActions';
import ShareActions from '../../actions/ActivityFeed/ShareActions';
import LoginStore from '../../stores/LoginStore';
import StatusStore from '../../stores/StatusStore';
import ActivityFeedActions from '../../actions/ActivityFeed/ActivityFeedActions';
import CommentAction from '../../actions/ActivityFeed/CommentAction';
import CommentStore from '../../stores/CommentStore';
import CommentList from '../comments/CommentList.react';
import Dialog from 'material-ui/lib/dialog';
import RaisedButton from 'material-ui/lib/raised-button';
import TextField from 'material-ui/lib/text-field';
import LikeStatusStore from '../../stores/LikeStatusStore';
import ShareStatusStore from '../../stores/ShareStatusStore';

const iconButtonElement = (
    <IconButton
        touch={true}
        tooltip="more"
        tooltipPosition="bottom-left">
        <MoreVertIcon color={Colors.deepPurple500} />
    </IconButton>
);

const style1 = {
    width: 800,
    margin: 40,
};

const style2 = {
    width: 800,
};

const ActivityList = React.createClass({

    getInitialState: function () {
        return {
            opens: false,
            liked: LikeStatusStore.getlikes(),
            shared: ShareStatusStore.getshares(),
            postId: StatusStore.getStatusID(),
            Checked: StatusStore.getcheckStatus(),
        };
    },

    componentDidMount: function () {
        LikeStatusStore.addChangeListener(this._onChange);
        LikesActions.getlikestatus();

        ShareStatusStore.addChangeListener(this._onChange);
        ShareActions.getsharestatus();

        //StatusStore.addChangeListener(this._onChange);
        ActivityFeedActions.getpostId();
        ActivityFeedActions.checkPost();
    },

    _onChange: function () {
        this.setState({postId: StatusStore.getStatusID()});
        this.setState({liked: LikeStatusStore.getlikes()});
        this.setState({shared: ShareStatusStore.getshares()});
        this.setState({checked: StatusStore.getcheckStatus()});

        if (LikeStatusStore.getlikes() == "false") {
            this.setState({
                liked: false,
            });
        }
        if (LikeStatusStore.getlikes() == "true") {
            this.setState({
                liked: true,
            });
        }

        if (ShareStatusStore.getshares() == "false") {
            this.setState({
                shared: false,
            });
        }
        if (ShareStatusStore.getshares() == "true") {
            this.setState({
                shared: true,
            });
        }

        if (StatusStore.getcheckStatus() == "false") {
            this.setState({
                Checked: false,
            });
        }
        if (StatusStore.getcheckStatus() == "true") {
            this.setState({
                Checked: true,
            });
        }
    },

    /**checkloggedUserzPost:function(){
        var email = LoginStore.getEmail();
        var postId = this.props.id;
        let checkPost = {
            PId: postId,
            Email: email,
        };
        ActivityFeedActions.checkPost(checkPost);
        console.log('Done checking');
    },*/

    editstatus: function () {
        let post_text= this.refs.EditBox.getValue();
        let postId= this.props.id;

        let editstatus={
          PostId: postId,
          Status: post_text,
          };
          ActivityFeedActions.editstatus(editstatus);
          console.log('Done calling !');
          this.handleClose();
    },

    deleteStatus: function () {
        var postId = this.props.id;
        let delete_status = {
            PostId: postId
        };
        ActivityFeedActions.delete_status(delete_status);
        console.log('Done deleting');
        this.handleClose();
    },

    _changeShareState:function() {

        var postId = this.props.id;
        var email = LoginStore.getEmail();
        var firstname = LoginStore.getFirstname();
        let add_share = {
            PostId: postId,
            Email: email,
            Fname: firstname
        };

        if (!this.state.shared) {
            console.log('share');
            this.setState({shared: !this.state.shared});
            ShareActions.add_share(add_share);
        }
        else {
            console.log('Unshare');
            this.setState({shared: !this.state.shared});
            ShareActions.del_share(add_share);
        }
    },

    setFocusToTextBox: function () {
        document.getElementById("mytext").focus();
    },

    _changeLikeState: function () {

        var postId = this.props.id;
        var email = LoginStore.getEmail();
        var firstname = LoginStore.getFirstname();
        let add_likes = {
            PostId: postId,
            Email: email,
            Fname: firstname
        };

        if (! this.state.liked) {
            console.log('like');
            this.setState({liked: !this.state.liked});
            LikesActions.like(add_likes);
        }
        else {
            console.log('Unlike');
            this.setState({liked: !this.state.liked});
            LikesActions.unlike(add_likes);
        }
    },

    handleOpen: function () {
        this.setState({opens: true});
    },

    handleClose: function () {
        this.setState({opens: false});
    },

    EnterKey_comment(e) {
        if (e.key === 'Enter') {
            console.log();
            console.log(this.refs.commentBox.getValue());
            var postId = this.props.id;
            var comment = this.refs.commentBox.getValue();
            var email = LoginStore.getEmail();
            var firstname = LoginStore.getFirstname();
            let add_comment = {
                PId: postId,
                Comment: comment,
                Email: email,
                Fname: firstname
            };
            CommentAction.add_comment(add_comment);
        }
    },

	render: function() {
     const actions = [
      <FlatButton
        label="Update"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.editstatus}/>,

      <FlatButton
        label="Close"
        secondary={true}
        onTouchTap={this.handleClose}/>,
    ];

		return (
			<div style={style1}>
			<div >
            <Card>
		        <ListItem
		          leftAvatar={<Avatar src="https://s-media-cache-ak0.pinimg.com/236x/dc/15/f2/dc15f28faef36bc55e64560d000e871c.jpg" />}
		          primaryText={this.props.firstname}
		          secondaryText={
		            <p>
		              <b>{this.props.created_at}</b><br/>
              			{this.props.post_text}
		            </p>
		          }
		          secondaryTextLines={2} 
		          rightIconButton={
                 <IconMenu iconButtonElement={iconButtonElement} closeOnItemTouchTap={this.state.Checked ? false : true}>
                    <MenuItem primaryText="Edit" onClick={this.handleOpen}/>
                    <MenuItem primaryText="Remove" onClick={this.deleteStatus}/>
                    <MenuItem primaryText="Block" />
                  </IconMenu> } />
		           	
             
                <IconButton onClick={this._changeLikeState} tooltip={this.state.liked ? "Unlike" : "Like"} touch={true} tooltipPosition="bottom-right">
                  {this.state.liked ? <FavIcon onClick={this._changeLikeState} viewBox="0 0 20 30" color={Colors.red500} /> : 
                            <FavIconBorder viewBox="0 0 20 30" color={Colors.red500} />}
                </IconButton>
               
    
          			<FlatButton label="Comment" onClick={this.setFocusToTextBox} />
          			<FlatButton label="Share" onClick={this._changeShareState}  secondary={this.state.shared ? true : false}/>
		        <Divider inset={true} />	   
            </Card>	
                <Dialog
                     title="Modify Your Status"
                     actions={actions}
                     modal={false}
                     open={this.state.opens}
                     onRequestClose={this.handleClose}>
                    <TextField hintText="Update your status" multiLine={false} fullWidth={true} ref="EditBox" defaultValue={this.props.post_text}/>
                </Dialog>
			</div>
            <div><CommentList /></div>
			<div style={style2}>
              <Paper>
                <TextField hintText="Write a comment..." multiLine={false} fullWidth={true} onKeyPress={this.EnterKey_comment} ref="commentBox" id="mytext"/>
              </Paper>
            </div>
			</div>
		);
	}
});

export default ActivityList;

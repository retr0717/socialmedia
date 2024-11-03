import { Alert, Share, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { theme } from '@/constants/theme';
import { hp, stripHtmlTags, wp } from '@/helpers/common';
import Avatar from './Avatar';
import moment from 'moment';
import Icon from '@/assets/icons';
import RenderHtml from 'react-native-render-html';
import { Image } from 'expo-image';
import { downloadFile, getSupabaseFileUrl } from '@/services/imageService';
import { Video } from 'expo-av';
import { createPostLike, removePostLike } from '@/services/postService';
import Loading from './Loading';

const textStyle = {
    color: theme.colors.dark,
    fontSize: hp(1.75)
}

const tagStyles = {
    div: textStyle,
    p: textStyle,
    ol: textStyle,
    h1: {
        color: theme.colors.dark
    },
    h4: {
        color: theme.colors.dark
    }
}

const PostCard = (
    {item, currentUser, router, hasShadow=true, showMoreIcon}:
    {item: any, currentUser: any, router: any, hasShadow: boolean, showMoreIcon: boolean}) => {

    const [likes, setLikes] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLikes(item?.postLikes);
    },[])
  
    const shadowStyles = {
        shadowOffset: { 
            width: 0,
            height: 2
        },
        shadowOpacity: 0.06,
        shadowRadius: 6,
        elevation: 1,
    }

    const onLike = async () => {

        if(liked)
        {
            const updatedLikes = likes.filter(like => like.userId!=currentUser?.id);
            setLikes([...updatedLikes]);
    
            let res = await removePostLike(item?.id, currentUser?.id);

            if(!res.success)
                {
                    Alert.alert('Post','Something went wrong!');
                }
        }
        else{

            let data = {
                userId: currentUser?.id,
                postId: item?.id
            }

            //@ts-ignore
            setLikes([...likes, data]);
    
            let res = await createPostLike(data);
            
            if(!res.success)
            {
                Alert.alert('Post','Something went wrong!');
            }
        }
        
    }

    const onPostDetails = () => {
        if(!showMoreIcon) return null;
        
        router.push({pathname: 'PostDetails', params: {postId: item?.id}})
    }

    const onShare = async () => {
        let content = {message: stripHtmlTags(item?.body)}

        if(item?.file)
        {
            //download and send the uri.
            setLoading(true);
            let url = await downloadFile(getSupabaseFileUrl(item?.file)?.uri);
            setLoading(false);

            content.url = url;
        }

        console.log(content);
        Share.share(content);
    }

    const createdAt = moment(item?.created_at).format('MMM D');
    const liked = likes.filter((like : any) => like.userId==currentUser?.id)[0] ? true : false;

    return (
    <View style={[styles.container, hasShadow && shadowStyles]}>
      <View style={styles.header}>

        {/* user info */}
        <View style={styles.userInfo}>
            <Avatar
                size={hp(4.5)}
                uri={item?.user?.image}
                rounded={theme.radius.md}
                style={{width :wp(8.8)}}
            />
            <View style={{gap : 2}}>
                <Text style={styles.username}>{item?.user?.name}</Text>
                <Text style={styles.userInfo}>{createdAt}</Text>
            </View>
        </View>

        {
            showMoreIcon && (
                <TouchableOpacity onPress={onPostDetails}>
                    <Icon name='threeDotsHorizontal' size={hp(3.5)} strokeWidth={3} color={theme.colors.text}/>
                </TouchableOpacity>
            )
        }

      </View>

      {/* post body and media */}
      <View style={styles.content}>
        <View style={styles.postBody}>
            {
                item?.body && (
                    <RenderHtml
                        contentWidth={wp(100)}
                        source={{html: item?.body}}
                        tagsStyles={tagStyles}
                    />
                )
            }
        </View>
        {
            item?.file && item?.file?.includes('postImages') && (
                <Image
                    source={getSupabaseFileUrl(item?.file)}
                    transition={100}
                    style={styles.postMedia}
                    contentFit='cover'
                />
            )
        }

        {/* video */}
        {
            item?.file && item?.file?.includes('postVideos') && (
                <Video
                    style={[styles.postMedia, {height: hp(35)}]}
                    source={getSupabaseFileUrl(item?.file)}
                    useNativeControls
                    resizeMode='cover'
                    isLooping   
                />
            )
        }
      </View>


    {/* like, share, comment */}
    <View style={styles.footer}>
        <View style={styles.footerButton}>
            <TouchableOpacity onPress={onLike}>
                <Icon 
                    name='heart' 
                    size={24}
                    fill={liked? theme.colors.rose : 'transparent'}
                    color={liked? theme.colors.rose : theme.colors.textLight}/>
            </TouchableOpacity>
            <Text style={styles.count} >{likes?.length}</Text>
        </View>

        <View style={styles.footerButton}>
            <TouchableOpacity onPress={onPostDetails}>
                <Icon name='comment' size={24} color={theme.colors.textLight}/>
            </TouchableOpacity>
            <Text style={styles.count} >0</Text>
        </View>

        <View style={styles.footerButton}>
            {
                loading? (
                    <Loading size='small'/>
                )
                :
                (
                    <TouchableOpacity onPress={onShare}>
                        <Icon name='share' size={24} color={theme.colors.textLight}/>
                    </TouchableOpacity>
                )
            }
        </View>

    </View>

    </View>
  )
}

export default PostCard;

const styles = StyleSheet.create({
    container: {
        gap: 10,
        marginBottom: 15,
        borderRadius: theme.radius.xxl*1.1,
        borderCurve: 'continuous',
        padding: 10,
        paddingVertical: 12,
        backgroundColor: 'white',
        borderWidth: 0.5,
        borderColor: theme.colors.gray,
        shadowColor: '#000'
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        fontSize: hp(1.4),
    },
    username: {
        fontSize: hp(1.9),
        color: theme.colors.textDark,
        fontWeight: theme.fonts.semibold
    },
    postMedia: {
        height: hp(40),
        width: '100%',
        borderRadius: theme.radius.xl,
        borderCurve: 'continuous',
    },
    content: {
        gap: 10,
    },
    postTime: {
        height: hp(1.4),
        color: theme.colors.textLight,
        fontWeight: '500',
    },
    postBody: {
        marginLeft: 5,
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
    },
    footerButton: {
        marginLeft: 5,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    actions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 18
    },
    count: {
        color: theme.colors.text,  
    }
})
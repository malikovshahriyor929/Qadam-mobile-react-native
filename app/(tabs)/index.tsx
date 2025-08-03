import HeaderWithProfile from '@/components/headerForHome';
import CarouselWithLanguage from '@/components/home/carusel';
import Location from '@/components/location';
import ButtonMy from '@/shared/generics/button';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Link, useRouter } from 'expo-router';
import { t } from 'i18next';
import React, { useEffect } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import Toast from 'react-native-toast-message';


const Mainpage = () => {
  const router = useRouter();
  const checkToken = async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      const lang = await AsyncStorage.getItem('language');
      console.log("TOKEN: ", token);
      if (!lang) {
        router.push("/auth/language")
      }
      if (!token && router) {
        router.replace('/auth/login');
      }
    } catch (error) {
      console.error('Failed to get access token:', error);
    }
  };
  const fn = async () => {
    await AsyncStorage.removeItem("access_token")
    checkToken()
  }
  const fnl = async () => {
    await AsyncStorage.removeItem("language")
    checkToken()
  }

  const fnt = () => {
    Toast.show({
      type: "success",
      text1: "This is a hot-toast style message 🎉",
      autoHide: true
    })
    // Toast.show({
    //   type: "info",
    //   text1: "salom",
    //   autoHide: true
    // })
    // Toast.show({
    //   type: "error",
    //   text1: "error",
    //   autoHide: false,
    // })
  }

  useEffect(() => {
    checkToken();
  }, []);




  return (
    <View>
      <HeaderWithProfile />
      <ScrollView className=' px-4  bg-white'>
        <Link href={ "/explore" }>
          <View className="mb-">
            <CarouselWithLanguage />
          </View>
        </Link>
        <Text className="font-semibold text-lg mb-3">{ t("home.nearby_pods") }</Text>
        <View className="mb-6">
          <Location />
        </View>
        <Text>Mainpage</Text>
        <Pressable onPress={ () => fn() }>
          <Text>
            clear local
          </Text>
        </Pressable>
        <Pressable onPress={ () => fnl() }>
          <Text>
            clear langaueg
          </Text>
        </Pressable>
        <ButtonMy key={ "As" } type='children'>
          <Pressable onPress={ () => fnt() }>
            <Text>
              clear langaueg
            </Text>
          </Pressable>
        </ButtonMy>
        <Text>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quod illo dolor harum sunt aliquam incidunt repellat ipsa illum eligendi aperiam magni facilis autem hic officia, quas nobis suscipit iure. Blanditiis laboriosam quibusdam unde odio eius culpa quos reiciendis dolores officia facere delectus nulla dolorum velit iusto autem voluptatum commodi magnam optio, vitae praesentium quod quas nam? Quo deleniti culpa, dolorem quaerat nisi pariatur aspernatur rerum ab harum cum quam eligendi earum facere fugit sapiente fugiat adipisci porro laboriosam magni iste? Tempore nisi, quae natus obcaecati quisquam eligendi, in adipisci quas exercitationem esse numquam, similique ut totam vitae odit. Iusto libero odio consectetur quibusdam quidem, consequuntur dolore modi magnam reprehenderit, distinctio repellendus nam placeat tempora! Assumenda voluptatum quae illum, id odio culpa quis labore perferendis, quia excepturi, non quam ad. Accusamus similique architecto ex, dolor aperiam soluta cum veritatis sint repudiandae id, iusto beatae aspernatur eveniet harum quasi consectetur libero, minus possimus exercitationem eos cumque. Sed ad doloremque natus veritatis praesentium distinctio eveniet, voluptas ducimus dolorem, ex neque. Deleniti facilis nihil dolor laborum. Autem veritatis optio quod. Error deserunt tempore illo, facilis aliquam voluptate et similique. Fuga quidem eveniet nulla laudantium excepturi quis possimus distinctio optio sunt pariatur unde voluptatum perferendis autem soluta veritatis, beatae mollitia facere rem? Sed molestias debitis, itaque aut numquam natus voluptatem nostrum aliquam eos asperiores quaerat, provident hic adipisci consequatur minima ab earum quasi ex dolore beatae odit obcaecati modi. Nam reprehenderit optio eius labore repudiandae at vitae repellat corrupti quisquam reiciendis blanditiis quam praesentium fugit doloremque sequi possimus sit dolorum in quo rerum impedit, incidunt quia. Quos aliquam, laudantium quam iste reiciendis distinctio earum! Quod facere debitis quos porro ab magnam voluptates in repellat totam eaque. Itaque laborum aut beatae, sed est nobis? Recusandae architecto cupiditate, veniam at provident illo quidem itaque. Cumque, esse adipisci officia voluptatum maxime nisi mollitia fugiat vel impedit beatae, fuga ducimus debitis dolore iure, ratione delectus qui velit harum excepturi quod suscipit. Quo exercitationem itaque cumque nesciunt impedit commodi ratione distinctio eos ipsum tempore quam amet, dolorum ipsa nihil ut illum quos delectus rem, nobis adipisci tempora minus! Excepturi delectus praesentium qui eius possimus similique totam quo debitis perferendis explicabo in, eligendi hic molestiae officia magni dolores quas eum, consequatur odio. Repudiandae, vitae. At rerum fugit excepturi similique, vitae maxime deleniti facilis. Quaerat, dolorum accusamus possimus consequuntur modi deserunt fugiat doloremque officia distinctio nostrum dignissimos nulla temporibus, impedit rem facere? Expedita iusto qui asperiores mollitia illum rerum explicabo possimus perspiciatis animi veritatis iure pariatur laboriosam error ex sed, ipsam accusamus. Corporis porro ea dolores eveniet consequatur, sint officiis, quas suscipit obcaecati reprehenderit error! Deleniti, accusantium nisi voluptatum ullam impedit ut fugit mollitia nostrum, sint sunt delectus accusamus doloremque deserunt. Repellat sapiente quidem beatae inventore libero reiciendis qui odit neque quo enim culpa, officia eveniet minima fugit iure? Laborum molestias dolore ea illum enim commodi veritatis optio totam excepturi? Sapiente aut perspiciatis maiores necessitatibus? Magni harum illo nostrum cupiditate! Placeat minus consequuntur exercitationem obcaecati ratione eveniet temporibus eius harum adipisci inventore officiis sint reprehenderit earum voluptas deleniti minima, pariatur cupiditate suscipit. Earum voluptatibus blanditiis molestiae similique totam, explicabo aut magnam eligendi nam repudiandae dicta nostrum vitae, ex iusto est. Illum, nobis magnam minus sapiente rerum, provident dolore vero temporibus voluptate deleniti ad corrupti quaerat? Beatae unde animi laborum quaerat quae quas quidem doloremque possimus consequuntur aperiam temporibus atque, veniam, neque tempora maiores suscipit quibusdam. Eum at voluptatibus facere consequatur cum placeat odio magnam ex quaerat, veritatis sapiente repellendus, quasi beatae dolor enim rerum accusamus! Porro, rem. Mollitia a dolore facere enim, sed officiis in iure consequuntur reiciendis aspernatur laborum asperiores, natus perspiciatis doloribus quasi tempore delectus est, deleniti repudiandae quaerat suscipit reprehenderit sequi saepe. Placeat eos, porro cum cumque ab totam fuga, unde voluptates eius excepturi architecto illo quidem. Repellendus ab perspiciatis vero cupiditate harum illo sequi assumenda, magnam obcaecati. Ipsum nisi eius aspernatur, cumque nesciunt itaque voluptas et molestias delectus voluptatem commodi, maxime, libero error. Quod tempora illum eligendi libero quia similique neque eaque, ea saepe dicta sed aspernatur cupiditate at, quaerat corporis aperiam fugiat, pariatur dolores deserunt eius in minus? Hic animi error voluptates libero numquam aspernatur accusamus incidunt dolorum. Repellendus incidunt alias cupiditate assumenda unde error ipsum, eveniet quisquam numquam veniam vitae id, nihil est inventore. Reprehenderit, vitae! Maiores voluptatibus voluptas pariatur veniam libero, dolorem iure sapiente hic quod voluptate ratione dolorum beatae voluptates consequuntur unde doloribus sequi sit minus alias nisi impedit. Earum dicta maiores temporibus beatae aspernatur suscipit exercitationem, iste sequi deserunt nostrum soluta saepe inventore ducimus. Blanditiis impedit ex omnis maiores ea quas, laudantium odit magnam quaerat sequi quasi labore sapiente eveniet distinctio provident necessitatibus commodi. Doloremque, quos? Consectetur minus maiores hic beatae et minima? Ducimus, error adipisci quia laboriosam distinctio quos nesciunt obcaecati! Illo, assumenda. Ex mollitia atque nemo temporibus totam in architecto quod ducimus quam doloremque veniam soluta modi omnis ad rem adipisci ratione porro, iste id, possimus tenetur dolor enim. Natus quibusdam ipsum perferendis veritatis voluptatum eius necessitatibus non voluptates incidunt, voluptas deserunt porro sit explicabo, adipisci cupiditate temporibus tenetur doloribus repellendus rem ab vero tempore omnis? Iusto, doloribus voluptatibus modi sunt quo quaerat eum, cum dignissimos ea possimus perspiciatis, expedita quibusdam? Rem deserunt non quod cupiditate blanditiis omnis perspiciatis asperiores, praesentium vel cum illum officiis, voluptas reiciendis quibusdam earum nesciunt harum expedita aliquid repudiandae eos facere distinctio corporis est. Nemo earum nulla commodi debitis dolorum voluptate magni at harum, quas accusantium perferendis incidunt eos unde animi ea beatae sunt necessitatibus, neque odit ratione placeat. Perferendis dolore porro provident tempore quis, dolores explicabo fugit. Soluta placeat eaque ipsa non facere nihil nemo aperiam provident similique! Qui alias dolorem saepe. Voluptatem accusantium saepe culpa dicta, velit officia repudiandae debitis libero sequi ad deleniti facere consequatur nam rem natus. Repellat itaque dolorem consequatur, odit numquam soluta necessitatibus dolorum voluptate ipsa nihil, sed dicta laborum accusamus. Sapiente neque omnis suscipit dolore, incidunt nulla quod saepe qui quisquam. Assumenda eius dignissimos optio asperiores et beatae quidem delectus, illo modi qui nisi temporibus at doloribus, quia repellendus!
        </Text>
      </ScrollView>
    </View>
  )
}

export default Mainpage